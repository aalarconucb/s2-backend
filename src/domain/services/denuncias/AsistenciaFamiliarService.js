const { ErrorApp } = require('../../lib/error')
const { Respuesta } = require('../../../application/lib/respuesta')
const { Finalizado, HttpCodes } = require('../../../application/lib/globals')
const { makePdf } = require('../../../common/lib/pdf');
const { toJSON } = require('../../../infrastructure/lib/util');

const numeroALetrasLib = require('@vigilio/numeros-a-letras')
const { parse, differenceInYears, differenceInMonths, differenceInDays, subMonths } = require('date-fns')

module.exports = function asistenciaFamiliarService (repositories) {
  const {
          AsistenciaFamiliarRepository,
          PartesAsistenciaFamiliarRepository,
          PersonaRepository,
          DependienteRepository,
          DependientesPartesAsistenciaRepository,
          ParametroRepository,
          DistritoRepository,
          DomicilioRepository,
          UsuarioRepository,
          DenunciaRepository,
          transaction } = repositories;

  async function crear (data) {
    let transaccion;
    try {
      transaccion = await transaction.create()
      const asistencia = await AsistenciaFamiliarRepository.createOrUpdate(data, transaccion);

      const personaSolicitante = await PersonaRepository.createOrUpdate({...data.solicitante}, transaccion)
      const domicilioPersonaSolictante = {
        direccion: data.solicitante.direccion,
        codigoMunicipio: data.solicitante.codigoMunicipio,
        idPersona: personaSolicitante.id
      }
      await DomicilioRepository.createOrUpdate(domicilioPersonaSolictante, transaccion)
      const parteSolicitante = {
        tipoParte: 'SOLICITANTE',
        relacionParentezcoDependiente: data.solicitante.relacionParentezcoDependiente,
        idPersona: personaSolicitante.id,
        idAsistenciaFamiliar: asistencia.id
      }
      const solicitante = await PartesAsistenciaFamiliarRepository.createOrUpdate(parteSolicitante, transaccion )

      const personaDemandado = await PersonaRepository.createOrUpdate({...data.demandado}, transaccion)
      const domicilioPersonaDemandado = {
        direccion: data.solicitante.direccion,
        codigoMunicipio: data.solicitante.codigoMunicipio,
        idPersona: personaDemandado.id
      }
      await DomicilioRepository.createOrUpdate(domicilioPersonaDemandado, transaccion)
      const parteDemandada = {
        tipoParte: 'DEMANDADO',
        relacionParentezcoDependiente: data.demandado.relacionParentezcoDependiente,
        idPersona: personaDemandado.id,
        idAsistenciaFamiliar: asistencia.id
      }
      const demandado = await PartesAsistenciaFamiliarRepository.createOrUpdate(parteDemandada, transaccion )

      const dependientes = data.dependientes
      for (const dep of dependientes) {
        const personaDependiente = await PersonaRepository.createOrUpdate({...dep}, transaccion)
        const dependiente = await DependienteRepository.createOrUpdate({
          idPersona: personaDependiente.id
        }, transaccion )

        const dpa1 = {
          idDependiente: dependiente.id,
          idParte: solicitante.id,
          idAsistenciaFamiliar: asistencia.id
        }
        const dpa2 = {
          idDependiente: dependiente.id,
          idParte: demandado.id,
          idAsistenciaFamiliar: asistencia.id
        }

        await Promise.all([
          DependientesPartesAsistenciaRepository.createOrUpdate(dpa1, transaccion ),
          DependientesPartesAsistenciaRepository.createOrUpdate(dpa2, transaccion )
        ])
      }

      await transaccion.commit()
    } catch (error) {
      if(transaccion && !transaccion.finished) await transaccion.rollback()
      throw new ErrorApp(error.message, 400);
    }
  }

  async function listar (params = {}) {
    try {
      const resultado = await AsistenciaFamiliarRepository.listar(params)
      const rows = armarRespuestaAsistencia(resultado.rows)
      resultado.rows = rows
      return resultado
    } catch (error) {
      throw new ErrorApp(error.message, 400)
    }
  }

  function armarRespuestaAsistencia(rows) {
    rows.map(asistencia => {
      let solicitante = {};
      let demandado = {};
      asistencia.partesAsistencia.forEach(parte => {
        if (parte.partesAFPersona) {
          const { genero, numeroDocumento, nombres, primerApellido, segundoApellido } = parte.partesAFPersona;
          switch (parte.tipoParte) {
            case 'SOLICITANTE':
              Object.assign(solicitante, {
                id: parte.id,
                idPersona: parte.id_persona,
                genero,
                numeroDocumento,
                nombres,
                primerApellido,
                segundoApellido
              });
              break;
            case 'DEMANDADO':
              Object.assign(demandado, {
                id: parte.id,
                idPersona: parte.id_persona,
                genero,
                numeroDocumento,
                nombres,
                primerApellido,
                segundoApellido
              });
              break;
          }
        } else {
          console.log('No se encontró partesAFPersona para esta parte.');
        }
      });
      asistencia.solicitante = solicitante;
      asistencia.demandado = demandado;
    });
    return rows;
  }

  async function findById(id) {
    try {
      const asistencia = await AsistenciaFamiliarRepository.findById(id)
      if (asistencia.idDenuncia) {
        const denunciaCodigo = await DenunciaRepository.obtenerCodigoDenuncia(asistencia.idDenuncia)
        asistencia.codigoRuv = denunciaCodigo.codigoRuv
      }
      const partes = await AsistenciaFamiliarRepository.getPartes(id)
      const { solicitante, demandado} = armarPartes(partes)
      const _dependientes = await AsistenciaFamiliarRepository.getDependientes(id)
      const dependientes = armarDependientes(_dependientes)
      const respuesta = {...asistencia, solicitante, demandado, dependientes}
      return respuesta
    } catch (error) {
      throw new ErrorApp(error.message, 400)
    }
  }

  function armarPartes(partes) {
    let solicitante = {}
    let demandado = {}
    partes.forEach( parte => {
      const {
        tipoDocumento,
        numeroDocumento,
        nombres,
        primerApellido,
        segundoApellido,
        genero,
        fechaNacimiento,
        estadoCivil,
        profesionOcupacion,
        parametroTipoDocumento
      } = parte.partesAFPersona
      const auxiliar = {
        id: parte.id,
        idPersona: parte.idPersona,
        relacionParentezcoDependiente: parte.relacionParentezcoDependiente,
        tipoParte: parte.tipoParte,
        idAsistenciaFamiliar: parte.idAsistenciaFamiliar,
        tipoDocumento,
        numeroDocumento,
        nombres,
        primerApellido,
        segundoApellido,
        genero,
        fechaNacimiento,
        estadoCivil,
        profesionOcupacion,
        parametroTipoDocumento
      }
      const domicilioReal = parte.partesAFPersona.domicilioPersona.find(domicilio => domicilio.tipoDomicilio === 'REAL')
      if(domicilioReal) {
        auxiliar.direccion = domicilioReal.direccion,
        auxiliar.codigoMunicipio = domicilioReal.codigoMunicipio
        auxiliar.municipio = domicilioReal.dpaDomicilio.municipio
      }

      switch(parte.tipoParte){
        case 'SOLICITANTE':
          solicitante = auxiliar
          break
        case 'DEMANDADO':
          demandado = auxiliar
          break
      }
    })
    return { solicitante, demandado }
  }

  function armarDependientes(dependientes) {
    let arrayDependientes = []
    dependientes.forEach( _dependiente => {
      const dependientePersona = _dependiente.dependientePersona || {}
      const {
        tipoDocumento,
        numeroDocumento,
        nombres,
        primerApellido,
        segundoApellido,
        genero,
        fechaNacimiento,
        estadoCivil,
        profesionOcupacion,
        parametroTipoDocumento
      } = dependientePersona

      const dependiente = {
        id: _dependiente.id,
        idPersona: _dependiente.idPersona,
        idVictima: _dependiente.idVictima,
        estudia: _dependiente.estudia,
        idAsistenciaFamiliar: _dependiente.DPADependiente[0].idAsistenciaFamiliar,
        tipoDocumento,
        numeroDocumento,
        nombres,
        primerApellido,
        segundoApellido,
        genero,
        fechaNacimiento,
        estadoCivil,
        profesionOcupacion,
        parametroTipoDocumento
      }
      arrayDependientes.push(dependiente)
    })
    return arrayDependientes
  }

  async function actualizar (idAsistenciaFamiliar, data) {
    let transaccion;
    try {
      transaccion = await transaction.create()
      const asistencia = await AsistenciaFamiliarRepository.createOrUpdate(data, transaccion)

      const parteSolicitante = {
        id: data.solicitante.id,
        tipoParte: 'SOLICITANTE',
        relacionParentezcoDependiente: data.solicitante.relacionParentezcoDependiente,
        idAsistenciaFamiliar: idAsistenciaFamiliar
      }
      const solicitante = await PartesAsistenciaFamiliarRepository.createOrUpdate(parteSolicitante, transaccion)
      const solicitantePersona = {
        ...data.solicitante,
        id: data.solicitante.idPersona
      }
      await PersonaRepository.createOrUpdate(solicitantePersona, transaccion)

      const parteDemandada = {
        id: data.demandado.id,
        tipoParte: 'DEMANDADO',
        relacionParentezcoDependiente: data.demandado.relacionParentezcoDependiente,
        idAsistenciaFamiliar: idAsistenciaFamiliar
      }
      const demandado = await PartesAsistenciaFamiliarRepository.createOrUpdate(parteDemandada, transaccion )
      const demandadoPersona = {
        ...data.demandado,
        id: data.demandado.idPersona
      }
      await PersonaRepository.createOrUpdate(demandadoPersona, transaccion)

      const dependientesExistentes = await AsistenciaFamiliarRepository.getDependientes(idAsistenciaFamiliar)
      const dependientesActualizados = data.dependientes.map(d => d.id)
      const dependientesEliminar = dependientesExistentes.filter(dep => !dependientesActualizados.includes(dep.id))
      for (const dependiente of dependientesEliminar) {
        for (const dpa of dependiente.DPADependiente) {
          const obj = {
            id: dpa.id,
            estado: 'INACTIVO'
          }
          await DependientesPartesAsistenciaRepository.createOrUpdate(obj, transaccion)
        }
      }

      // manejo de los dependientes
      const dependientes = data.dependientes
      for (const dependiente of dependientes) {
        let dependientePersona
        if(dependiente.idPersona){
          dependientePersona = {
            ...dependiente,
            id: dependiente.idPersona
          }
          await PersonaRepository.createOrUpdate(dependientePersona, transaccion)
          await DependienteRepository.createOrUpdate(dependiente, transaccion)
        } else {
          // Si es un dependiente nuevo
          dependientePersona = {
            ...dependiente
          }
          const persona = await PersonaRepository.createOrUpdate(dependientePersona, transaccion)
          dependiente.idPersona = persona.id
          const dep = await DependienteRepository.createOrUpdate(dependiente, transaccion)
          const dpa1 = {
            idDependiente: dep.id,
            idParte: solicitante.id,
            idAsistenciaFamiliar: idAsistenciaFamiliar
          }
          const dpa2 = {
            idDependiente: dep.id,
            idParte: demandado.id,
            idAsistenciaFamiliar: idAsistenciaFamiliar
          }
          await Promise.all([
            DependientesPartesAsistenciaRepository.createOrUpdate(dpa1, transaccion ),
            DependientesPartesAsistenciaRepository.createOrUpdate(dpa2, transaccion )
          ])
        }
      }

      await transaccion.commit()
      return asistencia
    } catch (error) {
      if(transaccion && !transaccion.finished) await transaccion.rollback()
      throw new ErrorApp(error.message, 400);
    }
  }

  async function generarDocumento (id) {
    let file = null
    try {
      const asistencia = await findById(id);
      const condicionUsuario = {
        id: asistencia.userCreated
      }
      const profesional = await UsuarioRepository.findOne(condicionUsuario)
      asistencia.profesional = `${profesional.nombres} ${profesional.primerApellido} ${profesional.segundoApellido}`

      if (asistencia.idDenuncia) {
        const denuncia = await DenunciaRepository.obtenerCodigoDenuncia(asistencia.idDenuncia)
        asistencia.codigoRuv = denuncia.codigoRuv
      }

      const _parametros = await ParametroRepository.filtrarPorGrupos(['ESTADO_CIVIL', 'GENERO', 'PARENTESCO_DEPENDIENTE'])
      const parametros = toJSON(_parametros).rows
      const distrito = await DistritoRepository.findById(asistencia.idDistrito)
      asistencia.nombreDistrito = distrito.nombre

      const resultado = generaAtributosDocumento(asistencia, parametros)
      file = await makePdf('acta-acuerdo-asistencia-familiar.html', resultado)
      return file;
    } catch (error) {
      throw new ErrorApp(error.message, 400);
    }
  }

  function generaAtributosDocumento(asistenciaFamiliar, parametros) {
    const [parteFecha, parteTiempo ] = asistenciaFamiliar.createdAt.split(' ')
    const [dia, mes, anio] = parteFecha.split('/')
    const [hora, minutos, segundos] = parteTiempo.split(':')
    const meses = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ]
    const mesLiteral = meses[parseInt(mes)-1]
    const horas = `${hora}:${minutos}`

    const _estadoCivilSolicitante = buscarParametroPorId(asistenciaFamiliar.solicitante.estadoCivil, parametros)
    asistenciaFamiliar.solicitante.estadoCivil = _estadoCivilSolicitante.toUpperCase()

    const _solicitanteParentesco = buscarParametroPorId(asistenciaFamiliar.solicitante.relacionParentezcoDependiente, parametros)
    asistenciaFamiliar.solicitante.relacionParentezcoDependiente = _solicitanteParentesco.toUpperCase()

    const _estadoCivilDemandado = buscarParametroPorId(asistenciaFamiliar.demandado.estadoCivil, parametros)
    asistenciaFamiliar.demandado.estadoCivil = _estadoCivilDemandado.toUpperCase()

    const _demandadoParentesco = buscarParametroPorId(asistenciaFamiliar.demandado.relacionParentezcoDependiente, parametros)
    asistenciaFamiliar.demandado.relacionParentezcoDependiente = _demandadoParentesco.toUpperCase()

    const numeroDependientes = asistenciaFamiliar.dependientes?.length

    asistenciaFamiliar.dependientes.forEach(dependiente => {
      dependiente.edad = calcularEdadLiteral(dependiente.fechaNacimiento)
    });

    const ciudad = asistenciaFamiliar.solicitante.municipio

    asistenciaFamiliar.solicitante.municipio = asistenciaFamiliar.solicitante.municipio.toUpperCase()
    asistenciaFamiliar.demandado.municipio = asistenciaFamiliar.demandado.municipio.toUpperCase()

    const esDinero = asistenciaFamiliar.tipoAsistencia === 'DINERO'
    const esEspecies = asistenciaFamiliar.tipoAsistencia === 'ESPECIES'

    let montoDineroLiteral = null, montoEspeciesLiteral = null
    if(asistenciaFamiliar.montoDinero){
      montoDineroLiteral = numeroALetrasLib.default(parseFloat(asistenciaFamiliar.montoDinero), false, { isInvoice: true })
    }

    if(asistenciaFamiliar.montoEspecies){
      montoEspeciesLiteral = numeroALetrasLib.default(parseFloat(asistenciaFamiliar.montoEspecies), false, { isInvoice: true })
    }

    return {
      ...asistenciaFamiliar,
      ciudad,
      parteFecha,
      horas,
      dia,
      mesLiteral,
      anio,
      numeroDependientes,
      esDinero,
      esEspecies,
      montoDineroLiteral,
      montoEspeciesLiteral
    }
  }

  function buscarParametroPorId(id, listaParametros) {
    const resultado = listaParametros.find(param => param.id === id);
    return resultado ? resultado.nombre : 'ID no encontrado';
  }

  function calcularEdad(fechaNacimiento) {
    const hoy = new Date();
    const [dia, mes, año] = fechaNacimiento.split('/').map(Number);
    const nacimiento = new Date(año, mes - 1, dia);

    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mesActual = hoy.getMonth();
    const diaActual = hoy.getDate();

    if (mesActual < nacimiento.getMonth() ||
        (mesActual === nacimiento.getMonth() && diaActual < nacimiento.getDate())) {
        edad--;
    }
    return edad;
  }

  async function actualizarEstado (idAsistenciaFamiliar, data) {
    const datos = {...data, id: idAsistenciaFamiliar}
    try {
      const resultado = await AsistenciaFamiliarRepository.createOrUpdate(datos);
      return resultado;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  function calcularEdadLiteral(fechaNacimientoString) {
    const hoy = new Date();
    const fechaNacimiento = parse(fechaNacimientoString, 'dd/MM/yyyy', new Date());
    // Verifica si la fecha de nacimiento está en el futuro
    if (fechaNacimiento > hoy) {
      return "Fecha de nacimiento en el futuro";
    }

    const anios = differenceInYears(hoy, fechaNacimiento);
    const fechasTrasAnios = subMonths(hoy, anios * 12);
    let meses = differenceInMonths(fechasTrasAnios, fechaNacimiento);

    // Ajusta los meses a 0 si resulta en un valor negativo
    if (meses < 0) {
      meses = 0;
    }

    // Construye el texto de la edad sin mostrar "0 meses"
    let edadString = `${anios} año${anios !== 1 ? 's' : ''}`;
    if (meses > 0) {
      edadString += `, ${meses} mes${meses !== 1 ? 'es' : ''}`;
    }

    // Solo agrega días si años y meses son cero
    if (anios === 0 && meses === 0) {
      const dias = differenceInDays(hoy, fechaNacimiento);
      edadString = `${dias} día${dias !== 1 ? 's' : ''}`;
    }

    return edadString;
  }

  return {
    crear,
    listar,
    armarRespuestaAsistencia,
    findById,
    actualizar,
    generarDocumento,
    calcularEdad,
    actualizarEstado
  };
};
