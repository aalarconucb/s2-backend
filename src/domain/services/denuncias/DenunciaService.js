const { ErrorApp } = require('../../lib/error');
const { makePdf } = require('../../../common/lib/pdf');
const { config } = require('../../../common');
const { escribirBase64, json2Csv } = require('../../lib/file');
const fs = require('fs');
const util = require('util');
const { toJSON } = require('../../../infrastructure/lib/util');
const readFile = util.promisify(fs.readFile);
const { obtenerFlujo } = require('../../lib/flujos');
const { obtenerFechaActual, formatearFechaVista } = require('../../lib/date');
const { format } = require('date-fns');

const path = require('path');

module.exports = function denunciaService (repositories) {
  const {
    DenunciaRepository, DistritoRepository, UsuarioRepository,
    ParametroRepository, VictimaPoblacionVulnerableRepository, VictimaAutoIdentificacionRepository,
    UsuarioCasoRepository, RolRepository, DenunciaHistoricoRepository,
    VictimaRepository, PersonaRepository, MunicipioRepository, DpaRepository,
    RedRepository, SolicitudTransferenciaRepository, DependienteRepository, DenunciadoRepository, DenuncianteRepository,
    transaction
  } = repositories;

  // Solo admite pdf
  async function guardarArchivo (nombreDirectorio, prefijoArchivo, documento) {
    const ext = '.pdf'
    const nombreArchivo = `${prefijoArchivo}-${Date.now()}.${ext}`;
    const ruta = await escribirBase64(nombreDirectorio, nombreArchivo, documento);
    return ruta;
  }

  async function createOrUpdate (idDistrito, data) {
    // console.log("🚀 ~ createOrUpdate ~ data:", data)
    let transaccion;
    try {
      transaccion = await transaction.create();
      data.idDistrito = idDistrito;
      // buscar data de idDistrito
      const distrito = await DistritoRepository.buscarDpaDistrito(idDistrito);

      // generar Codigo y Secuencial
      const { codigoMunicipio } = distrito.municipioDistrito;
      const siglaMunicipio = distrito.municipioDistrito.dpaMunicipio.sigla;
      const { codigo, secuencial } = await generarCodigoRuv(codigoMunicipio, siglaMunicipio);
      data.codigoRuv = codigo;
      data.secuencial = secuencial;

      // subir y guardar documento pdf
      if (data.documento) {
        const rutaDocumento = await guardarArchivo(config.app.raizDenuncias, 'adjunto-denuncia', data.documento);
        data.rutaDocumento = rutaDocumento;
      }

      // buscar asignacion
      const { tipologiaPrincipal } = data;
      const tipologia = await ParametroRepository.findById(tipologiaPrincipal);
      // const profesional = buscarProfesionalPorTipologia(tipologia.codigo);
      const [origen] = obtenerFlujo(tipologia.codigo);
      console.log("🚀 ~ createOrUpdate ~ origen:", origen)
      const { profesional, paso, instrumentos, horas } = origen;
      console.log(profesional, paso, instrumentos, horas);

      // const usuario = await UsuarioRepository.buscarUsuarioPorRolDistrito(idDistrito, profesional);
      // let denuncia;

      /* if (usuario) {
        data.estado = 'ASIGNADO';
        denuncia = await DenunciaRepository.crear(data, transaccion);
        await UsuarioCasoRepository.createOrUpdate({
          idUsuario   : usuario.id,
          idDenuncia  : denuncia.toJSON().id,
          paso,
          instrumentos,
          horas,
          userCreated : data.userCreated || data.userUpdated
        }, transaccion);
      } else {
      } */

      // const denuncia = await DenunciaRepository.crear(data, transaccion);
      const denuncia = await DenunciaRepository.createOrUpdate(data, transaccion);
      console.log('🚀 ~ createOrUpdate ~ denuncia:', denuncia)

      //Crear victima
      const [datosVictima] = data.victimaDenuncia;
      if (datosVictima) {
        const personaVictima = await PersonaRepository.createOrUpdate(datosVictima.victimaPersona, transaccion);
        datosVictima.idPersona = personaVictima.id
        datosVictima.idDenuncia = denuncia.id
        const victima = await VictimaRepository.createOrUpdate(datosVictima, transaccion);

        // Crear dependientes
        if (datosVictima.dependienteVictima && datosVictima.dependienteVictima.length !== 0) {
          for (const dependiente of datosVictima.dependienteVictima) {
            dependiente.idVictima = victima.id;
            const persona = await PersonaRepository.createOrUpdate(dependiente.dependientePersona, transaccion);
            dependiente.idPersona = persona.id;
            await DependienteRepository.createOrUpdate(dependiente, transaccion);
          }
        }

        // Crear población vulnerable:
        for (const id of datosVictima.pobVulnerable) {
          const obj = {
            idVictima: victima.id,
            idPoblacionVulnerable: id,
          };
          await VictimaPoblacionVulnerableRepository.createOrUpdate(obj, transaccion);
        }

        // Crear autoidentificacion
        const idAutoIdentificacion = datosVictima.puebloOriginario
        if (idAutoIdentificacion !== null) {
          const obj = {
            idVictima             : victima.id,
            idAutoIdentificacion  : idAutoIdentificacion,
          }
          await VictimaAutoIdentificacionRepository.createOrUpdate(obj, transaccion)
        }
      }

      // Crear denunciante
      const [datosDenunciante] = data.denuncianteDenuncia;
      if (datosDenunciante) {
        if (datosDenunciante.denunciantePersona) {
          const persona = await PersonaRepository.createOrUpdate(datosDenunciante.denunciantePersona, transaccion);
          datosDenunciante.idPersona = persona.id;
        }
        datosDenunciante.idDenuncia = denuncia.id
        await DenuncianteRepository.createOrUpdate(datosDenunciante, transaccion);
      }

      // Crear denunciados
      if (data.denunciadoDenuncia.length !== 0) {
        for (const denunciado of data.denunciadoDenuncia) {
          if(denunciado.denunciadoPersona) {
            const persona = await PersonaRepository.createOrUpdate(denunciado.denunciadoPersona, transaccion);
            denunciado.idPersona = persona.id;
          }
          denunciado.idDenuncia = denuncia.id;
          await DenunciadoRepository.createOrUpdate(denunciado, transaccion);
        }
      }

      await transaction.commit(transaccion);
      return denuncia;
    } catch (error) {
      await transaction.rollback(transaccion);
      throw new ErrorApp(error.message, 400);
    }
  }

  async function actualizar(idDenuncia, data) {
    console.log("🚀 ~ actualizar ~ data:", data);
    let transaccion;
    try {
      if (data.motivoModificacion) {
        console.log("🚀 ~ Iniciando transacción...");
        transaccion = await transaction.create();

        const datosHistorico = {
          motivoModificacion: data.motivoModificacion,
          userCreated: data.userUpdated,
          idDenuncia: idDenuncia,
        };
        console.log("🚀 ~ Guardando histórico de denuncia:", datosHistorico);
        await DenunciaHistoricoRepository.createOrUpdate(datosHistorico, transaccion);

        const datosDenuncia = {
          id: idDenuncia,
          tipologiaSecundaria: data.tipologiaSecundaria,
          relacionHecho: data.relacionHecho,
          direccionHecho: data.direccionHecho,
          fechaHecho: data.fechaHecho
        };
        console.log("🚀 ~ Actualizando denuncia:", datosDenuncia);
        const denuncia = await DenunciaRepository.createOrUpdate(datosDenuncia, transaccion);

        // victima
        const [datosVictima] = data.victimaDenuncia;
        if (datosVictima) {
          console.log("🚀 ~ Actualizando datos de la víctima...");
          const victima = await VictimaRepository.createOrUpdate(datosVictima, transaccion);
          console.log("🚀 ~ Datos de la víctima actualizados:", victima);

          // datos persona victima
          console.log("🚀 ~ Actualizando datos de la persona víctima...");
          await PersonaRepository.createOrUpdate(datosVictima.victimaPersona, transaccion);

          if (datosVictima.dependienteVictima && datosVictima.dependienteVictima.length !== 0) {
            for (const dependiente of datosVictima.dependienteVictima) {
              dependiente.idVictima = victima.id;
              console.log("🚀 ~ Actualizando datos del dependiente:", dependiente);
              const persona = await PersonaRepository.createOrUpdate(dependiente.dependientePersona, transaccion);
              dependiente.idPersona = persona.id;
              await DependienteRepository.createOrUpdate(dependiente, transaccion);
            }
          }

          console.log("🚀 ~ Actualizando datos de población vulnerable...");
          const victimaPoblacionVulnerableExistente = await VictimaPoblacionVulnerableRepository.getByIdVictima(datosVictima.id);
          const idsExistentes = victimaPoblacionVulnerableExistente.map( v => v.idPoblacionVulnerable)

          const victimaPoblacionVulnerableEliminar = victimaPoblacionVulnerableExistente.filter(
            (v) => !datosVictima.pobVulnerable.includes(v.idPoblacionVulnerable)
          );

          for (const vpne of victimaPoblacionVulnerableEliminar) {
            console.log("🚀 ~ Eliminando población vulnerable:", vpne);
            await VictimaPoblacionVulnerableRepository.deleteItem(vpne.id, transaccion);
          }

          const idsParaCrear = datosVictima.pobVulnerable.filter(id => !idsExistentes.includes(id))

          //Crear solo registros faltantes
          for (const id of idsParaCrear) {
            const obj = {
              idVictima: datosVictima.id,
              idPoblacionVulnerable: id,
            };
            console.log("🚀 ~ Creando nueva población vulnerable:", obj);
            await VictimaPoblacionVulnerableRepository.createOrUpdate(obj, transaccion);
          }
        }

        const [datosDenunciante] = data.denuncianteDenuncia;
        if (datosDenunciante) {
          console.log("🚀 ~ Procesando datos del denunciante...");
          if (datosDenunciante.denunciantePersona) {
            const persona = await PersonaRepository.createOrUpdate(datosDenunciante.denunciantePersona, transaccion);
            datosDenunciante.idPersona = persona.id;
          }
          await DenuncianteRepository.createOrUpdate(datosDenunciante, transaccion);
        }

        if (data.denunciadoDenuncia.length !== 0) {
          for (const denunciado of data.denunciadoDenuncia) {
            console.log("🚀 ~ Procesando datos del denunciado:", denunciado);
            if(denunciado.denunciadoPersona) {
              const persona = await PersonaRepository.createOrUpdate(denunciado.denunciadoPersona, transaccion);
              denunciado.idPersona = persona.id;
            }
            denunciado.idDenuncia = denuncia.id;
            await DenunciadoRepository.createOrUpdate(denunciado, transaccion);
          }
        }

        console.log("🚀 ~ Completando transacción...");
        await transaction.commit(transaccion);
        return denuncia;
      } else {
        throw new Error("El motivo de la modificación es obligatorio.");
      }
    } catch (error) {
      console.error("❌ Error en la función 'actualizar':", error.message);
      console.error("❌ Stack trace:", error.stack);
      if (transaccion) {
        console.log("⚠️ Realizando rollback...");
        await transaction.rollback(transaccion);
      }
      throw new ErrorApp(error.message, 400);
    }
  }

  function buscarProfesionalPorTipologia (tipologia) {
    if (['TPG-VFM', 'TPG-VFS', 'TPG-VSX', 'TPG-VPS', 'TPG-VPE'].indexOf(tipologia) >= 0) {
      return 'PSICOLOGO';
    } else if (['TPG-VSX'].indexOf(tipologia) >= 0) {
      return 'ABOGADO';
    } else if (['TPG-VMT', 'TPG-SME', 'TPG-CDG', 'TPG-CDR', 'TPG-ESS', 'TPG-ESEP', 'TPG-AVP', 'TPG-INS', 'TPG-CLS', 'TPG-VLB', 'TPG-AFM'].indexOf(tipologia) >= 0) {
      return 'TRABAJADOR_SOCIAL';
    }
  }

  //Funcion para generar codigo RUV en base a codigo de municipio
  //El secuencial es por departamento
  // async function generarCodigoRuv (codigoMunicipio) {
  //   console.log("🚀 ~ generarCodigoRuv ~ codigoMunicipio:", codigoMunicipio)
  //   const departamentos = {
  //     '01' : 'CH',
  //     '02' : 'LP',
  //     '03' : 'CB',
  //     '04' : 'OR',
  //     '05' : 'PT',
  //     '06' : 'TJ',
  //     '07' : 'SC',
  //     '08' : 'BN',
  //     '09' : 'PD'
  //   };

  //   const codDepartamento = codigoMunicipio.substr(0, 2);
  //   const codMunicipio = codigoMunicipio.substr(2, 2);
  //   const anio =  new Date().getFullYear();
  //   const gestion = anio % 100;
  //   const [secuencialDepartamento] = await DenunciaRepository.obtenerSecuencial(codDepartamento, anio);

  //   const secuencial = secuencialDepartamento && secuencialDepartamento.max ? secuencialDepartamento.max + 1 : 1;
  //   const codigo = `${departamentos[codDepartamento]}-${codMunicipio}-RUV-${secuencial.toString().padStart(6, 0)}-${gestion}`;

  //   return { codigo, secuencial };
  // }

    async function generarCodigoRuv (codigoMunicipio, siglaMunicipio) {
    const departamentos = {
      '01' : 'CH',
      '02' : 'LP',
      '03' : 'CB',
      '04' : 'OR',
      '05' : 'PT',
      '06' : 'TJ',
      '07' : 'SC',
      '08' : 'BN',
      '09' : 'PD'
    };

    const codDepartamento = codigoMunicipio.substr(0, 2);
    const anio =  new Date().getFullYear();
    const gestion = anio;
    const [secuencialDepartamento] = await DenunciaRepository.obtenerSecuencial(anio);

    const secuencial = secuencialDepartamento && secuencialDepartamento.max ? secuencialDepartamento.max + 1 : 1;
    const codigo = `${departamentos[codDepartamento]}-${siglaMunicipio}-RUV-${secuencial.toString().padStart(6, 0)}-${gestion}`;

    return { codigo, secuencial };
  }

  async function generarPdf (idDenuncia) {
    try {
      const denuncia = await DenunciaRepository.obtenerDetalleDenuncia(idDenuncia);
      const victima = await DenunciaRepository.obtenerDetalleVictima(idDenuncia);
      const denunciados = await DenunciaRepository.obtenerDetalleDenunciados(idDenuncia);
      const denunciante = await DenunciaRepository.obtenerDetalleDenunciante(idDenuncia);
      const file = await makePdf('denuncia.html', { ...denuncia, denunciante, denunciados, victima });

      return file;
    } catch (error) {
      throw new ErrorApp(error.message, 400);
    }
  }

  async function buscarPorNumeroDocumento (numeroDocumento) {
    try {
      const denuncia = await DenunciaRepository.buscarPorNumeroDocumento(numeroDocumento);

      return denuncia;
    } catch (error) {
      throw new ErrorApp(error.message, 400);
    }
  }

  async function listarDenuncias (params) {
    try {
      return DenunciaRepository.listar(params);
    } catch (error) {
      throw new ErrorApp(error.message, 400);
    }
  }

  async function listarDenunciasPorRol (datosUsuario, params) {
    console.log("🚀 ~ listarDenunciasPorRol ~ params:", params)
    try {
      const [idRol] = datosUsuario.idRoles;
      const idUsuario = datosUsuario.idUsuario;
      const usuario = await UsuarioRepository.findById(idUsuario);

      const existeRol = await RolRepository.findById(idRol);
      if (existeRol) {
        if (existeRol.nombre === 'SUPERVISOR_DEPARTAMENTAL') {
          params.codDepartamento = usuario.codDepartamento;
        }
        if (['SUPERVISOR_MUNICIPAL', 'ADMINISTRADOR_MUNICIPAL'].indexOf(existeRol.nombre) >= 0) {
          params.idMunicipio = usuario.idMunicipio;
        }
        if (['ABOGADO', 'PSICOLOGO', 'TRABAJADOR_SOCIAL'].indexOf(existeRol.nombre) >= 0) {
          params.idDistrito = usuario.idDistrito;
        }
      } else {
        throw new Error('No tiene permisos para realizar esta accion');
      }
      return DenunciaRepository.listar(params);
    } catch (error) {
      throw new ErrorApp(error.message, 400);
    }
  }

  async function listarDenunciasPorUsuario (datosUsuario, params) {
    try {
      const [idRol] = datosUsuario.idRoles;
      const idUsuario = datosUsuario.idUsuario;
      const usuario = await UsuarioRepository.findById(idUsuario);

      const existeRol = await RolRepository.findById(idRol);
      if (existeRol) {
        if (existeRol.nombre === 'SUPERVISOR_DEPARTAMENTAL') {
          params.codDepartamento = usuario.codDepartamento;
        }
        if (['SUPERVISOR_MUNICIPAL', 'ADMINISTRADOR_MUNICIPAL'].indexOf(existeRol.nombre) >= 0) {
          params.idMunicipio = usuario.idMunicipio;
        }
        if (['ABOGADO', 'PSICOLOGO', 'TRABAJADOR_SOCIAL'].indexOf(existeRol.nombre) >= 0) {
          params.idDistrito = usuario.idDistrito;
        }
      } else {
        throw new Error('No tiene permisos para realizar esta acción');
      }
      const response = await DenunciaRepository.listarPorUsuario(idUsuario, params);
      return response
    } catch (error) {
      throw new ErrorApp(error.message, 400);
    }
  }

  async function obtenerDenuncia (idDenuncia) {
    try {
      const denuncia = await DenunciaRepository.obtenerDetalleDenuncia(idDenuncia);

      const victima = await DenunciaRepository.obtenerDetalleVictima(idDenuncia);
      const denunciados = await DenunciaRepository.obtenerDetalleDenunciados(idDenuncia);
      const denunciante = await DenunciaRepository.obtenerDetalleDenunciante(idDenuncia);

      return { ...denuncia, victima, denunciante, denunciados };
    } catch (error) {
      throw new ErrorApp(error.message, 400);
    }
  }

  async function buscarPersona (numeroDocumento) {
    try {
      const persona = await DenunciaRepository.buscarPersona(numeroDocumento);
      return persona;
    } catch (error) {
      throw new ErrorApp(error.message, 400);
    }
  }

  async function buscarVictimaHistorial (idDenuncia) {
    try {
      const victima = await DenunciaRepository.obtenerVictima(idDenuncia);
      if (victima) {
        const { numeroDocumento, nombres, primerApellido, segundoApellido } = victima.victimaDenuncia[0].victimaPersona;
        if (numeroDocumento) {
          // buscar denuncias para el nroDocumento
          const denuncias = await DenunciaRepository.buscarPorNumeroDocumento(numeroDocumento);
          return denuncias;
        } else {
          const denuncias = await DenunciaRepository.buscarPorNombreApellido(nombres, primerApellido, segundoApellido);
          return denuncias;
        }
      }
      return victima;
    } catch (error) {
      throw new ErrorApp(error.message, 400);
    }
  }

  async function buscarDenunciadoHistorial (idDenuncia) {
    try {
      const denunciados = await DenunciaRepository.obtenerDenunciados(idDenuncia);
      return denunciados;
    } catch (error) {
      throw new ErrorApp(error.message, 400);
    }
  }

  async function asignarProfesional (idDenuncia, data) {
    let transaccion;
    try {
      transaccion = await transaction.create();
      const denuncia = await DenunciaRepository.buscarPorId(idDenuncia);
      const { idUsuario } = data;
      const existeUsuario = await UsuarioRepository.findById(idUsuario);

      if (denuncia && existeUsuario) {
        await UsuarioCasoRepository.createOrUpdate({
          idDenuncia,
          idUsuario,
          userCreated: data.userCreated || data.userUpdated
        }, transaccion);
      } else {
        throw new Error('Error en el usuario o la denuncia');
      }

      await transaction.commit(transaccion);
      return denuncia;
    } catch (error) {
      await transaction.rollback(transaccion);
      throw new ErrorApp(error.message, 400);
    }
  }

  async function actualizarEstadoDenuncia (idDenuncia, data) {
    let transaccion;
    try {
      transaccion = await transaction.create();
      data.id = idDenuncia;
      if (!data.estado || !data.observaciones) {
        throw new Error('Es necesario un estado y observaciones');
      }

      const denuncia = await DenunciaRepository.createOrUpdate(data, transaccion);

      await transaction.commit(transaccion);
      return denuncia;
    } catch (error) {
      await transaction.rollback(transaccion);
      throw new ErrorApp(error.message, 400);
    }
  }

  async function obtenerAdjunto (idDenuncia) {
    try {
      const denuncia = await DenunciaRepository.obtenerDetalleDenuncia(idDenuncia);

      if (denuncia && denuncia.rutaDocumento) {
        const rutaDocumento = denuncia.rutaDocumento;
        const doc = await readFile(rutaDocumento);
        return doc;
      } else {
        throw new Error('no existe el adjunto para la denuncia');
      }
    } catch (error) {
      throw new ErrorApp(error.message, 400);
    }
  }

  async function generarReporteDetalle (params, datosUsuario, tipo) {
    try {
      const idUsuario = datosUsuario.idUsuario;
      const usuario = await UsuarioRepository.findById(idUsuario);
      const resultados = await DenunciaRepository.generarReporteDetalle(params, usuario);
      console.log("🚀 ~ generarReporteDetalle ~ resultados:", resultados)

      const [idRol] = datosUsuario.idRoles;
      const existeRol = await RolRepository.findById(idRol);
      if (existeRol) {
        if (existeRol.nombre === 'SUPERVISOR_DEPARTAMENTAL') {
          resultados.rows = [];
          resultados.count = 0;
        }
      } else {
        throw new Error('No tiene permisos para realizar esta accion');
      }
      if (tipo === 'csv') {
        if (existeRol.nombre === 'SUPERVISOR_DEPARTAMENTAL') {
          resultados.rows = await generarReporteEstadistico(params, datosUsuario, 'json');
        }
        return json2Csv(resultados.rows);
      } else if (tipo === 'pdf') {
        const estadisticos = await generarReporteEstadistico(params, datosUsuario, 'array');
        if (params.parentezco) {
          const parametroParentesco = await ParametroRepository.findById(params.parentezco);
          params.descripcionParentezco = parametroParentesco.nombre;
        }
        if (params.tipologia) {
          const parametroTipologia = await ParametroRepository.findById(params.tipologia);
          params.descripcionTipologia = parametroTipologia.nombre;
        }
        if (params.idMunicipio) {
          const datosMunicipio = await MunicipioRepository.findById(params.idMunicipio);
          params.nombreMunicipio = datosMunicipio.nombre;
        }
        if (params.codDepartamento) {
          const datosDepartamento = await DpaRepository.obtenerInformacionDepartamento(params.codDepartamento);
          params.nombreDepartamento = datosDepartamento.departamento;
        }
        if (params.idSlim) {
          const datosSlim = await DistritoRepository.findById(params.idSlim);
          params.nombreSlim = datosSlim.nombre;
        }
        if (params.idRed) {
          const datosRed = await RedRepository.findById(params.idRed);
          params.nombreRed = datosRed.nombre;
        }
        params.fechaGeneracion = obtenerFechaActual();

        const file = await makePdf('reporte-detalle.html', { ...resultados, estadisticos, params });
        return file;
      }
      return resultados;
    } catch (error) {
      throw new ErrorApp(error.message, 400);
    }
  }

  async function generarReporteEstadistico (params, datosUsuario, tipo) {
    try {
      const idUsuario = datosUsuario.idUsuario;
      const usuario = await UsuarioRepository.findById(idUsuario);

      // generar lista de tipologias
      const tipologias = await ParametroRepository.filtrarPorGrupo('TIPOLOGIAS');
      const fields = [];
      const totales = [];
      const resJson = [];
      for (const tipologia of toJSON(tipologias).rows) {
        const [tmp] = await DenunciaRepository.generarReporteEstadistico({ ...params, tipologia: tipologia.id }, usuario);

        fields.push(tipologia.nombre);
        const total = tmp && tmp.count ? parseInt(tmp.count) : 0;
        totales.push(total);

        resJson.push({ tipologia: tipologia.nombre, total });
      }
      if (tipo && tipo !== 'json') {
        return { fields, totales };
      } else {
        return resJson;
      }
    } catch (error) {
      throw new ErrorApp(error.message, 400);
    }
  }

  async function generarReporteGeneral (params) {
    try {
      console.log('general');
      if (params.fechaInicio && params.fechaFin) {
        const resultados = await DenunciaRepository.generarReporteGeneral(params);

        if (params.tipo === 'csv') {
          return json2Csv(resultados);
        }
        return resultados;
      } else {
        throw new Error('El rango de fechas es obligatorio');
      }
    } catch (error) {
      throw new ErrorApp(error.message, 400);
    }
  }

  async function asignarCaso (idDenuncia, idUsuario, datosUsuario) {
    try {
      const usuarioAsignado = await UsuarioCasoRepository.obtenerInformacionDenuncia(idDenuncia);
      if (usuarioAsignado) {
        console.log(usuarioAsignado);
        const caso = usuarioAsignado.usuario[0].usuario_caso;

        await UsuarioCasoRepository.createOrUpdate({
          id          : caso.id,
          estado      : 'FINALIZADO',
          userUpdated : datosUsuario.id
        });
        // asignar a nuevo profesional
        await UsuarioCasoRepository.createOrUpdate({
          idUsuario,
          idDenuncia,
          paso         : 1,
          instrumentos : ['TMP'],
          horas        : 48,
          userCreated  : datosUsuario.id
        });
      } else {
        const transaccion = await transaction.create();
        const data = {
          id     : idDenuncia,
          estado : 'ASIGNADO'
        };
        await DenunciaRepository.createOrUpdate(data, transaccion);
        const caso = await UsuarioCasoRepository.createOrUpdate({
          idUsuario,
          idDenuncia,
          paso         : 1,
          horas        : 48,
          userCreated  : datosUsuario.id,
          instrumentos : ['TMP']
        }, transaccion);
        await transaction.commit(transaccion);
        return caso;
      }
    } catch (error) {
      throw new ErrorApp(error.message, 400);
    }
  }

  async function crearTransferencia (idDenuncia, datosTransferencia, datosUsuario) {
    try {
      // buscar datos denuncia
      const denuncia = await DenunciaRepository.buscarPorId(idDenuncia);
      if (denuncia) {
        const slimDestino = await DistritoRepository.findById(datosTransferencia.slimDestino);
        if (slimDestino) {
          const { id } = denuncia.distritoDenuncia;
          const solicitudTransferencia = {
            motivo            : datosTransferencia.motivo,
            idDistritoOrigen  : id,
            idDistritoDestino : datosTransferencia.slimDestino,
            userCreated       : datosUsuario.id,
            idDenuncia
          };
          const transferencia = await SolicitudTransferenciaRepository.createOrUpdate(solicitudTransferencia);

          await DenunciaRepository.createOrUpdate(
            {
              id          : idDenuncia,
              idDistrito  : datosTransferencia.slimDestino,
              userUpdated : datosUsuario.id
            }
          );

          return transferencia;
        } else {
          throw new Error('No existe el Slim de destino');
        }
      } else {
        throw new Error('No existe la denuncia');
      }
    } catch (error) {
      throw new ErrorApp(error.message, 400);
    }
  }

  async function listarParaAsistencia (datosUsuario, params) {
    try {
      const [idRol] = datosUsuario.idRoles;
      const idUsuario = datosUsuario.idUsuario;
      const usuario = await UsuarioRepository.findById(idUsuario);

      const existeRol = await RolRepository.findById(idRol);
      if (existeRol) {
        if (existeRol.nombre === 'SUPERVISOR_DEPARTAMENTAL') {
          params.codDepartamento = usuario.codDepartamento;
        }
        if (['SUPERVISOR_MUNICIPAL', 'ADMINISTRADOR_MUNICIPAL'].indexOf(existeRol.nombre) >= 0) {
          params.idMunicipio = usuario.idMunicipio;
        }
        if (['ABOGADO', 'PSICOLOGO', 'TRABAJADOR_SOCIAL'].indexOf(existeRol.nombre) >= 0) {
          params.idDistrito = usuario.idDistrito;
        }
      } else {
        throw new Error('No tiene permisos para realizar esta acción');
      }
      const denuncias = await DenunciaRepository.listarParaAsistencia(params)

      let idsDependientes = []
      for (const denuncia of denuncias.rows) {
        const ids = denuncia.victimaDenuncia[0].dependienteVictima.map(dep => dep.id)
        idsDependientes = idsDependientes.concat(ids)
      }
      const dependientes = await DependienteRepository.obtenerDependientes(idsDependientes)

      // Agrupar dependientes por `idVictima`
      const dependientesPorVictima = dependientes.reduce((acumulador, dependiente) => {
        if (!acumulador[dependiente.idVictima]) {
          acumulador[dependiente.idVictima] = [];
        }
        acumulador[dependiente.idVictima].push(dependiente);
        return acumulador;
      }, {});

      for (const denuncia of denuncias.rows) {
        // Reemplazamos dependienteVictima dado el error en la profundidad de la anidacion
        denuncia.victimaDenuncia[0].dependienteVictima = dependientesPorVictima[denuncia.victimaDenuncia[0].id] || [];
      }

      // Filtramos para incluir solo las denuncias que tienen dependientes
      denuncias.rows = denuncias.rows.filter(denuncia => denuncia.victimaDenuncia[0].dependienteVictima.length > 0);

      return denuncias

    } catch (error) {
      throw new ErrorApp(error.message, 400);
    }
  }

  async function cuadroInformativo (idDistrito) {
    try {
      const cantidad = await DenunciaRepository.getDenunciasPorAnio(idDistrito);
      const topTipologiasPorAnio = await DenunciaRepository.getTopTipologiasPorAnio(idDistrito);

      // Crear un mapa para acceder rápidamente a las tipologías por año
      const tipologiasMap = new Map(
        topTipologiasPorAnio.map((item) => [item.anio, item.top_tipologias])
      );

      const resultado = cantidad.map((item) => ({
        anio: String(item.anio),
        total_denuncias: Number(item.total_denuncias), // Convertir a número
        fecha_ultimo_registro: format(new Date(item.fecha_ultimo_registro), 'dd/MM/yyyy HH:mm:ss'),
        top_tipologias: tipologiasMap.get(String(item.anio)) || [], // Recuperar del mapa o usar un array vacío
      }));

      return resultado
    } catch (error) {
      throw new ErrorApp(error.message, 400);
    }
  }

  async function generarReporteNacional (params, usuario) {
    console.log("🚀 ~ generarReporteNacional ~ params:", params)
    try {
      if (params.tipoReporte === 'consolidado') {
        const resultados = await DenunciaRepository.generarReporteNacionalDepartamental(params);
        const departamentos = agruparPorDepartamento(resultados)
        const resumen = resumenNacional(departamentos)
        params.fechaInicio = formatearFechaVista(params.fechaInicio)
        params.fechaFin = formatearFechaVista(params.fechaFin)
        const file = await makePdf('reportes-nacional.html', { departamentos: departamentos, params: params, usuario: usuario, resumen: resumen }, 'reportes');
        return file
      } else if(params.tipoReporte === 'listado') {
        const resultados = await DenunciaRepository.generarReporteNacionalDepartamental(params);
        const departamentos = agruparPorDepartamento(resultados)
        const resumen = resumenNacional(departamentos)

        const listado = await DenunciaRepository.generarReporteListadoNacionalDepartamental(params);
        // const listado = agruparListadoPorDepartamento(resultado_listado)

        params.fechaInicio = formatearFechaVista(params.fechaInicio)
        params.fechaFin = formatearFechaVista(params.fechaFin)
        const file = await makePdf('reportes-listado-nacional.html', { listado: listado, departamentos: departamentos, params: params, usuario: usuario, resumen: resumen }, 'reportes');
        return file
      }


    } catch (error) {
      throw new ErrorApp(error.message, 400);
    }
  }

  async function generarReporteDepartamental (params, usuario) {
    try {
      const resultados = await DenunciaRepository.generarReporteNacionalDepartamental(params)
      const departamentos = agruparPorDepartamento(resultados)

      const departamento = await DpaRepository.obtenerInformacionDepartamento(params.codigoDepartamento)
      params.fechaInicio = formatearFechaVista(params.fechaInicio)
      params.fechaFin = formatearFechaVista(params.fechaFin)
      const file = await makePdf('reportes-departamental.html', { departamentos: departamentos, departamento: departamento, params: params, usuario: usuario }, 'reportes');
      return file
    } catch (error) {
      throw new ErrorApp(error.message, 400);
    }
  }

  async function generarReporteMunicipal (params, usuario) {
    try {
      const resultados = await DenunciaRepository.generarReporteMunicipal(params)
      const municipio = await DpaRepository.obtenerMunicipio(params.codigoMunicipio)
      const resumen = resumenMunicipal(municipio, resultados)

      params.fechaInicio = formatearFechaVista(params.fechaInicio)
      params.fechaFin = formatearFechaVista(params.fechaFin)

      const file = await makePdf('reportes-municipal.html', { distritos: resultados, resumen: resumen, params: params, usuario: usuario, municipio: municipio }, 'reportes');
      return file
    } catch (error) {
      throw new ErrorApp(error.message, 400);
    }
  }

  function agruparPorDepartamento(resultados) {
    // Se utiliza reduce para acumular la información agrupada
    const agrupacion = resultados.reduce((acc, item) => {
      // Limpiar espacios en los nombres de departamento
      const depto = item.departamento.trim();

      // Si aún no se ha creado la entrada para este departamento, se inicializa
      if (!acc[depto]) {
        acc[depto] = {
          nombre: depto.toUpperCase(),
          resumen: {
            totalRegistros: 0,
            totalUsuarios: 0,
            totalSlim: 0,
          },
          municipios: [],
        };
      }

      // Acumular los totales convirtiendo los strings a números
      acc[depto].resumen.totalRegistros += parseInt(item.cantidad_registros, 10);
      acc[depto].resumen.totalUsuarios += parseInt(item.total_usuarios_por_municipio, 10);
      acc[depto].resumen.totalSlim += parseInt(item.cantidad_slim_por_municipio, 10);

      // Agregar el registro del municipio a la lista correspondiente
      acc[depto].municipios.push(item);

      return acc;
    }, {});

    // Convertir el objeto de agrupaciones en un array para facilitar la iteración en la plantilla
    return Object.values(agrupacion);
  }

  function resumenNacional(departamentos) {
    const resumenPlano = departamentos.map(({nombre, resumen, municipios}) => ({
      nombre,
      totalRegistros: resumen.totalRegistros,
      totalUsuarios:  resumen.totalUsuarios,
      totalSlim:      resumen.totalSlim,
      totalMunicipios: municipios.length
    }))

    const totalesNacionales = resumenPlano.reduce((acc, dept) =>{
      acc.totalRegistros += dept.totalRegistros;
      acc.totalUsuarios  += dept.totalUsuarios;
      acc.totalSlim      += dept.totalSlim;
      acc.totalMunicipios += dept.totalMunicipios;
      return acc;
    }, { totalRegistros: 0, totalUsuarios: 0, totalSlim: 0, totalMunicipios: 0, totalDepartamentos: departamentos.length })
    return { resumenPlano, totalesNacionales }
  }

  function resumenMunicipal(municipio, resultados) {
    if (!resultados || resultados.length === 0) {
      return {
        municipio: municipio.municipio,
        total_denuncias: 0,
        total_usuarios_activos: 0,
        total_slim: 0
      };
    }

    let totalDenuncias = 0;
    let totalUsuariosActivos = 0;
    let totalSlim = resultados.length;
    resultados.forEach(item => {
      totalDenuncias += parseInt(item.total_denuncias, 10);
      totalUsuariosActivos += parseInt(item.total_usuarios_activos, 10);
    });
    return {
      municipio: municipio.municipio,
      total_denuncias: totalDenuncias,
      total_usuarios_activos: totalUsuariosActivos,
      total_slim: totalSlim
    };
  }

  // function agruparListadoPorDepartamento(data) {
  //   const agrupado = {};
  //   data.forEach(item => {
  //     const departamento = item.departamento?.trim() || 'SIN DEPARTAMENTO';
  //     if (!agrupado[departamento]) {
  //       agrupado[departamento] = [];
  //     }
  //     agrupado[departamento].push(item);
  //   });
  //   return agrupado;
  // }

  return {
    createOrUpdate,
    generarPdf,
    buscarPorNumeroDocumento,
    listarDenuncias,
    listarDenunciasPorUsuario,
    buscarPersona,
    buscarVictimaHistorial,
    buscarDenunciadoHistorial,
    obtenerDenuncia,
    asignarProfesional,
    listarDenunciasPorRol,
    actualizarEstadoDenuncia,
    obtenerAdjunto,
    actualizar,
    generarReporteDetalle,
    generarReporteEstadistico,
    generarReporteGeneral,
    asignarCaso,
    crearTransferencia,
    listarParaAsistencia,
    cuadroInformativo,
    resumenMunicipal,
    generarReporteNacional,
    generarReporteDepartamental,
    generarReporteMunicipal,
    // agruparListadoPorDepartamento
  };
};
