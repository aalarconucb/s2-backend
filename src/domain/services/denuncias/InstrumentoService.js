const { ErrorApp } = require('../../lib/error');
const { escribirBase64 } = require('../../lib/file');
const dayjs = require('dayjs');
const { config } = require('../../../common');
const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const { obtenerFlujo } = require('../../lib/flujos');
const { makePdf } = require('../../../common/lib/pdf');

module.exports = function instrumentoService (repositories) {
  const {
    DenunciaRepository, DocumentoAsistenciaFamiliarRepository,
    FichaPsicologicaRepository, FichaSeguimientoLegalRepository,
    FichaSeguimientoPsicologicoRepository, FichaSeguimientoSocialRepository,
    FichaSocialRepository, FichaVisitaSocialRepository, InformeLegalRepository,
    InformePsicologicoRepository, InformeSocialRepository, MemorialRepository,
    TerapiaExternaRepository, InterrupcionLegalEmbarazoRepository,
    DocumentoAsistenciaFamiliarAdjuntoRepository, FichaSeguimientoSocialAdjuntoRepository,
    FichaSocialAdjuntoRepository, FichaVisitaSocialAdjuntoRepository, PersonaRepository,
    TerapiaSlimRepository, DependienteRepository,
    ParametroRepository, VictimaPoblacionVulnerableRepository, VictimaRepository,
    CertificadoMedicoRepository, NotaExternaRepository, CitacionRepository,
    UsuarioCasoRepository, UsuarioRepository, SolicitudAtencionRepository,
    AsistenciaFamiliarRepository,
    transaction
  } = repositories;

  async function verificarDenuncia (idDenuncia) {
    const existeDenuncia = await DenunciaRepository.buscarPorId(idDenuncia);
    if (!existeDenuncia) {
      throw new Error('No existe la denuncia');
    }
    return existeDenuncia;
  }

  async function guardarArchivo (nombreDirectorio, prefijoArchivo, documento) {
    const extension = documento.split(';')[0].split('/')[1] || 'pdf';
    const nombreArchivo = `${prefijoArchivo}-${Date.now()}.${extension}`;
    const ruta = await escribirBase64(nombreDirectorio, nombreArchivo, documento);
    return ruta;
  }

  async function crearDocumentoAsistenciaFamiliar (idDenuncia, data) {
    try {
      await verificarDenuncia(idDenuncia);
      data.idDenuncia = idDenuncia;
      if (data.documento) {
        // guardar documento
        const rutaDocumento = await guardarArchivo(config.app.raizDocumentos, 'documento-asistencia-familiar', data.documento);
        delete data.documento;
        data.rutaDocumento = rutaDocumento;
        data.fecha = dayjs().format('DD/MM/YYYY');
      }

      const resultado = await DocumentoAsistenciaFamiliarRepository.createOrUpdate(data);
      return resultado;
    } catch (error) {
      throw new ErrorApp(error.message, 400);
    }
  }

  async function adicionarAdjuntoDocumentoAsistenciaFamiliar (idInstrumento, data) {
    try {
      data.idDocumentoAsistenciaFamiliar = idInstrumento;
      if (data.documento) {
        const rutaDocumento = await guardarArchivo(config.app.raizDocumentos, 'doc-asistencia-familiar-adjunto', data.documento);
        delete data.documento;
        data.rutaDocumento = rutaDocumento;
        const resultado = await DocumentoAsistenciaFamiliarAdjuntoRepository.createOrUpdate(data);
        return resultado;
      } else {
        throw new Error('No existe el adjunto');
      }
    } catch (error) {
      throw new ErrorApp(error.message, 400);
    }
  }

  async function validarAsignacion (idDenuncia, data, codigoInstrumento) {
    // preguntar en que paso esta
    /* const usuarioAsignado = await UsuarioCasoRepository.obtenerInformacionDenuncia(idDenuncia);
    if (usuarioAsignado) {
      console.log(usuarioAsignado);
      const caso = usuarioAsignado.usuario[0].usuario_caso;

      const { codigo } = usuarioAsignado.parametroTipologiaPrincipal;
      const flujo = obtenerFlujo(codigo);
      const pasoSiguiente = flujo[caso.paso];

      // finalizar asignacion
      const { profesional, paso, instrumentos, horas } = pasoSiguiente;
      const usuario = await UsuarioRepository.buscarUsuarioPorRolDistrito(usuarioAsignado.idDistrito, profesional);
      if (caso.instrumentos.indexOf(codigoInstrumento) >= 0 && usuario) {
        await UsuarioCasoRepository.createOrUpdate({
          id          : caso.id,
          estado      : 'FINALIZADO',
          userCreated : data.userCreated || data.userUpdated
        });
        // asignar a nuevo profesional
        await UsuarioCasoRepository.createOrUpdate({
          idUsuario   : usuario.id,
          idDenuncia,
          paso,
          instrumentos,
          horas,
          userCreated : data.userCreated || data.userUpdated
        });
      }
    } else {
      // buscar en derivaciones
      const solicitudAtencion = await SolicitudAtencionRepository.obtenerSolicitudesPorDenuncia(idDenuncia);
      if (solicitudAtencion && solicitudAtencion.length > 0) {
        console.log(solicitudAtencion);
        const sol = {
          id     : solicitudAtencion[0].id,
          estado : 'ATENDIDA'
        };
        await SolicitudAtencionRepository.createOrUpdate(sol);
      }
    } */
    const solicitudAtencion = await SolicitudAtencionRepository.obtenerSolicitudesPorDenuncia(idDenuncia);
    if (solicitudAtencion && solicitudAtencion.length > 0) {
      const sol = {
        id     : solicitudAtencion[0].id,
        estado : 'ATENDIDA'
      };
      await SolicitudAtencionRepository.createOrUpdate(sol);
    }
  }
  async function crearFichaPsicologica (idDenuncia, data) {
    try {
      await validarAsignacion(idDenuncia, data, 'IPS-FPS');
      data.idDenuncia = idDenuncia;
      if (data.documento) {
        // guardar documento
        const rutaDocumento = await guardarArchivo(config.app.raizDocumentos, 'ficha-psicologica', data.documento);
        delete data.documento;
        data.rutaDocumento = rutaDocumento;
        data.fecha = dayjs().format('DD/MM/YYYY');
      }

      const resultado = await FichaPsicologicaRepository.createOrUpdate(data);
      return resultado;
    } catch (error) {
      throw new ErrorApp(error.message, 400);
    }
  }

  async function crearFichaSeguimientoLegal (idDenuncia, data) {
    try {
      await validarAsignacion(idDenuncia, data, 'ILG-FSL');
      data.idDenuncia = idDenuncia;
      if (data.documento) {
        // guardar documento
        const rutaDocumento = await guardarArchivo(config.app.raizDocumentos, 'ficha-seguimiento-legal', data.documento);
        delete data.documento;
        data.rutaDocumento = rutaDocumento;
        data.fecha = dayjs().format('DD/MM/YYYY');
        data.resultadosObtenidos = 'documento-adjunto';
      }
      const resultado = await FichaSeguimientoLegalRepository.createOrUpdate(data);
      return resultado;
    } catch (error) {
      throw new ErrorApp(error.message, 400);
    }
  }

  async function crearFichaSeguimientoPsicologico (idDenuncia, data) {
    try {
      await validarAsignacion(idDenuncia, data, 'IPS-FSP');
      data.idDenuncia = idDenuncia;

      if (data.documento) {
        // guardar documento
        const rutaDocumento = await guardarArchivo(config.app.raizDocumentos, 'ficha-seguimiento-psicologico', data.documento);
        delete data.documento;
        data.rutaDocumento = rutaDocumento;
        data.fecha = dayjs().format('DD/MM/YYYY');
        data.accionRealizada = 'documento-adjunto';
      }

      const resultado = await FichaSeguimientoPsicologicoRepository.createOrUpdate(data);
      return resultado;
    } catch (error) {
      throw new ErrorApp(error.message, 400);
    }
  }

  async function crearFichaSeguimientoSocial (idDenuncia, data) {
    try {
      await validarAsignacion(idDenuncia, data, 'ISC-FSS');
      data.idDenuncia = idDenuncia;

      if (data.documento) {
        // guardar documento
        const rutaDocumento = await guardarArchivo(config.app.raizDocumentos, 'ficha-seguimiento-social', data.documento);
        delete data.documento;
        data.rutaDocumento = rutaDocumento;
        data.fecha = dayjs().format('DD/MM/YYYY');
      }

      const resultado = await FichaSeguimientoSocialRepository.createOrUpdate(data);
      return resultado;
    } catch (error) {
      throw new ErrorApp(error.message, 400);
    }
  }

  async function adicionarAdjuntoFichaSeguimientoSocial (idInstrumento, data) {
    try {
      data.idFichaSeguimientoSocial = idInstrumento;
      if (data.documento) {
        const rutaDocumento = await guardarArchivo(config.app.raizDocumentos, 'doc-ficha-seg-social-adjunto', data.documento);
        delete data.documento;
        data.rutaDocumento = rutaDocumento;
        const resultado = await FichaSeguimientoSocialAdjuntoRepository.createOrUpdate(data);
        return resultado;
      } else {
        throw new Error('No existe el adjunto');
      }
    } catch (error) {
      throw new ErrorApp(error.message, 400);
    }
  }

  async function crearFichaSocial (idDenuncia, data) {
    let transaccion;
    try {
      transaccion = await transaction.create();
      await validarAsignacion(idDenuncia, data, 'ISC-FSC');
      // guardar datos victima
      const victima = await DenunciaRepository.obtenerDetalleVictima(idDenuncia);
      if (data.victima) {
        if (data.victima.puebloOriginario) {
          const datosVictima = {
            id               : victima.id,
            puebloOriginario : data.victima.puebloOriginario
          };
          await VictimaRepository.createOrUpdate(datosVictima, transaccion);
        }
        if (data.victima.estadoCivil) {
          const datosPersona = {
            id          : victima.victimaPersona.id,
            estadoCivil : data.victima.estadoCivil
          };
          await PersonaRepository.createOrUpdate(datosPersona, transaccion);
        }
        if (data.victima.pobVulnerable) {
          for (const pobVulnerable of data.victima.pobVulnerable) {
            const existeParametro = await ParametroRepository.findById(pobVulnerable);
            if (existeParametro) {
              await VictimaPoblacionVulnerableRepository.createOrUpdate({
                idVictima             : victima.id,
                idPoblacionVulnerable : pobVulnerable,
                userUpdated           : data.userCreated || data.userUpdated
              }, transaccion);
            }
          }
        }
        if (data.victima.dependienteVictima && data.victima.dependienteVictima.length > 0) {
          for (const dependiente of data.victima.dependienteVictima) {
            await DependienteRepository.crear({
              idVictima: victima.id,
              ...dependiente
            }, transaccion);
          }
        }
      }
      data.idDenuncia = idDenuncia;

      if (data.documento) {
        // guardar documento
        const rutaDocumento = await guardarArchivo(config.app.raizDocumentos, 'ficha-social', data.documento);
        delete data.documento;
        data.rutaDocumento = rutaDocumento;
        data.fecha = dayjs().format('DD/MM/YYYY');
      }

      const resultado = await FichaSocialRepository.createOrUpdate(data, transaccion);
      await transaction.commit(transaccion);
      return resultado;
    } catch (error) {
      await transaction.rollback(transaccion);
      throw new ErrorApp(error.message, 400);
    }
  }

  async function adicionarAdjuntoFichaSocial (idInstrumento, data) {
    try {
      data.idFichaSocial = idInstrumento;
      if (data.documento) {
        const rutaDocumento = await guardarArchivo(config.app.raizDocumentos, 'doc-ficha-social-adjunto', data.documento);
        delete data.documento;
        data.rutaDocumento = rutaDocumento;
        const resultado = await FichaSocialAdjuntoRepository.createOrUpdate(data);
        return resultado;
      } else {
        throw new Error('No existe el adjunto');
      }
    } catch (error) {
      throw new ErrorApp(error.message, 400);
    }
  }

  async function crearFichaVisitaSocial (idDenuncia, data) {
    try {
      await validarAsignacion(idDenuncia, data, 'ISC-FVS');
      data.idDenuncia = idDenuncia;

      if (data.documento) {
        // guardar documento
        const rutaDocumento = await guardarArchivo(config.app.raizDocumentos, 'ficha-visita-social', data.documento);
        delete data.documento;
        data.rutaDocumento = rutaDocumento;
        data.fecha = dayjs().format('DD/MM/YYYY');
        data.accionesRealizar = 'documento-adjunto';
      }

      const resultado = await FichaVisitaSocialRepository.createOrUpdate(data);
      return resultado;
    } catch (error) {
      throw new ErrorApp(error.message, 400);
    }
  }

  async function adicionarAdjuntoFichaVisitaSocial (idInstrumento, data) {
    try {
      data.idFichaVisitaSocial = idInstrumento;
      if (data.documento) {
        const rutaDocumento = await guardarArchivo(config.app.raizDocumentos, 'doc-ficha-vis-social-adjunto', data.documento);
        delete data.documento;
        data.rutaDocumento = rutaDocumento;
        const resultado = await FichaVisitaSocialAdjuntoRepository.createOrUpdate(data);
        return resultado;
      } else {
        throw new Error('No existe el adjunto');
      }
    } catch (error) {
      throw new ErrorApp(error.message, 400);
    }
  }

  async function crearInformeLegal (idDenuncia, data) {
    try {
      await validarAsignacion(idDenuncia, data, 'ILG-INL');
      data.idDenuncia = idDenuncia;

      if (data.documento) {
        // guardar documento
        const rutaDocumento = await guardarArchivo(config.app.raizDocumentos, 'informe-legal', data.documento);
        delete data.documento;
        data.rutaDocumento = rutaDocumento;
        data.fecha = dayjs().format('DD/MM/YYYY');
        data.nroCite = 'documento-adjunto';
        data.a = 'documento-adjunto';
        data.via = 'documento-adjunto';
        data.de = 'documento-adjunto';
        data.referencia = 'documento-adjunto';
        data.conclusiones = 'documento-adjunto';
        data.recomendaciones = 'documento-adjunto';
      }

      const resultado = await InformeLegalRepository.createOrUpdate(data);
      return resultado;
    } catch (error) {
      throw new ErrorApp(error.message, 400);
    }
  }

  async function crearInformePsicologico (idDenuncia, data) {
    try {
      await validarAsignacion(idDenuncia, data, 'IPS-IPS');
      data.idDenuncia = idDenuncia;

      if (data.documento) {
        // guardar documento
        const rutaDocumento = await guardarArchivo(config.app.raizDocumentos, 'informe-psicologico', data.documento);
        delete data.documento;
        data.rutaDocumento = rutaDocumento;
        data.fecha = dayjs().format('DD/MM/YYYY');
        data.nroCite = 'documento-adjunto';
        data.a = 'documento-adjunto';
        data.via = 'documento-adjunto';
        data.de = 'documento-adjunto';
        data.referencia = 'documento-adjunto';
        data.recomendaciones = 'documento-adjunto';
        data.conclusiones = 'documento-adjunto';
      }

      const resultado = await InformePsicologicoRepository.createOrUpdate(data);
      return resultado;
    } catch (error) {
      throw new ErrorApp(error.message, 400);
    }
  }

  async function crearInformeSocial (idDenuncia, data) {
    try {
      // await verificarDenuncia(idDenuncia);
      await validarAsignacion(idDenuncia, data, 'ISC-INS');
      data.idDenuncia = idDenuncia;

      if (data.documento) {
        // guardar documento
        const rutaDocumento = await guardarArchivo(config.app.raizDocumentos, 'informe-social', data.documento);
        delete data.documento;
        data.rutaDocumento = rutaDocumento;
        data.fecha = dayjs().format('DD/MM/YYYY');
        data.nroCite = 'documento-adjunto';
        data.a = 'documento-adjunto';
        data.via = 'documento-adjunto';
        data.de = 'documento-adjunto';
        data.recomendaciones = 'documento-adjunto';
        data.conclusiones = 'documento-adjunto';
      }

      const resultado = await InformeSocialRepository.createOrUpdate(data);
      return resultado;
    } catch (error) {
      throw new ErrorApp(error.message, 400);
    }
  }

  async function crearMemorial (idDenuncia, data) {
    try {
      await validarAsignacion(idDenuncia, data, 'ILG-MEM');
      data.idDenuncia = idDenuncia;

      if (data.documento) {
        // guardar documento
        const rutaDocumento = await guardarArchivo(config.app.raizDocumentos, 'memorial', data.documento);
        delete data.documento;
        data.rutaDocumento = rutaDocumento;
      }

      const resultado = await MemorialRepository.createOrUpdate(data);
      return resultado;
    } catch (error) {
      throw new ErrorApp(error.message, 400);
    }
  }

  async function obtenerDocumentoAsistenciaFamiliar (id) {
    try {
      const resultado = await DocumentoAsistenciaFamiliarRepository.findById(id);
      return resultado;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function obtenerFichaPsicologica (id) {
    try {
      const resultado = await FichaPsicologicaRepository.findById(id);
      return resultado;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function obtenerFichaSeguimientoLegal (id) {
    try {
      const resultado = await FichaSeguimientoLegalRepository.findById(id);
      return resultado;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function obtenerFichaSeguimientoPsicologico (id) {
    try {
      const resultado = await FichaSeguimientoPsicologicoRepository.findById(id);
      return resultado;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function obtenerFichaSeguimientoSocial (id) {
    try {
      const resultado = await FichaSeguimientoSocialRepository.findById(id);
      return resultado;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function obtenerFichaSocial (id) {
    try {
      const resultado = await FichaSocialRepository.findById(id);
      return resultado;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function obtenerFichaVisitaSocial (id) {
    try {
      const resultado = await FichaVisitaSocialRepository.findById(id);
      return resultado;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function obtenerInformeLegal (id) {
    try {
      const resultado = await InformeLegalRepository.findById(id);
      return resultado;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function obtenerInformePsicologico (id) {
    try {
      const resultado = await InformePsicologicoRepository.findById(id);
      return resultado;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function obtenerInformeSocial (id) {
    try {
      const resultado = await InformeSocialRepository.findById(id);
      return resultado;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function obtenerMemorial (id) {
    try {
      const resultado = await MemorialRepository.findById(id);
      return resultado;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  function adicionarTipo (lista, tipoInstrumento, ruta) {
    return lista.map((item) => ({ ...item, tipoInstrumento, ruta }));
  }

  async function obtenerInstrumentos (idDenuncia) {
    try {
      const asistenciasFamiliares = await AsistenciaFamiliarRepository.listarParaDetalle(idDenuncia)
      console.log("🚀 ~ obtenerInstrumentos ~ asistenciasFamiliares:", asistenciasFamiliares)
      // const documentosAsistenciaFamiliar = await DocumentoAsistenciaFamiliarRepository.listar(idDenuncia);
      const fichasPsicologicas = await FichaPsicologicaRepository.listar(idDenuncia);
      const fichasSeguimientoLegal = await FichaSeguimientoLegalRepository.listar(idDenuncia);
      const fichasSeguimientoPsicologico = await FichaSeguimientoPsicologicoRepository.listar(idDenuncia);
      const fichasSeguimientoSocial = await FichaSeguimientoSocialRepository.listar(idDenuncia);
      const fichasSociales = await FichaSocialRepository.listar(idDenuncia);
      const fichasVisitaSocial = await FichaVisitaSocialRepository.listar(idDenuncia);
      const informesLegales = await InformeLegalRepository.listar(idDenuncia);
      const informesPsicologicos = await InformePsicologicoRepository.listar(idDenuncia);
      const informesSociales = await InformeSocialRepository.listar(idDenuncia);
      const memoriales = await MemorialRepository.listar(idDenuncia);
      const terapiasSlim = await TerapiaSlimRepository.listar(idDenuncia);
      const terapiasExternas = await TerapiaExternaRepository.listar(idDenuncia);
      const certificadosMedicos = await CertificadoMedicoRepository.listar(idDenuncia);
      const notasExternas = await NotaExternaRepository.listar(idDenuncia);
      const citaciones = await CitacionRepository.listar(idDenuncia);
      console.log("🚀 ~ obtenerInstrumentos ~ citaciones:", citaciones)

      return [
        ...adicionarTipo(fichasPsicologicas, 'Ficha Psicologica', 'ficha-psicologica'),
        ...adicionarTipo(fichasSeguimientoPsicologico, 'Ficha de Seguimiento Psicologico', 'ficha-seguimiento-psicologico'),
        ...adicionarTipo(informesPsicologicos, 'Informe Psicologico', 'informe-psicologico'),
        ...adicionarTipo(fichasSeguimientoSocial, 'Ficha de Seguimiento Social', 'ficha-seguimiento-social'),
        ...adicionarTipo(fichasSociales, 'Ficha Social', 'ficha-social'),
        ...adicionarTipo(fichasVisitaSocial, 'Ficha de Visita Social', 'ficha-visita-social'),
        ...adicionarTipo(informesSociales, 'Informe Social', 'informe-social'),
        ...adicionarTipo(informesLegales, 'Informe Legal', 'informe-legal'),
        ...adicionarTipo(fichasSeguimientoLegal, 'Ficha de Seguimiento Legal', 'ficha-seguimiento-legal'),

        ...adicionarTipo(asistenciasFamiliares, 'Asistencia Familiar', 'asistencia-familiar'),
        // ...adicionarTipo(documentosAsistenciaFamiliar, 'Documento de Asistencia Familiar', 'documento-asistencia-familiar'),
        ...adicionarTipo(memoriales, 'Memorial', 'memorial'),
        ...adicionarTipo(terapiasSlim, 'Terapia Slim', 'terapia-slim'),
        ...adicionarTipo(terapiasExternas, 'Terapia Externa', 'terapia-externa'),
        ...adicionarTipo(certificadosMedicos, 'Certificado Medico', 'certificado-medico'),
        ...adicionarTipo(notasExternas, 'Nota Externa', 'nota-externa'),
        ...adicionarTipo(citaciones, 'Citacion', 'citacion')
      ].sort((a, b) => formatearFecha(b.createdAt).getTime() - formatearFecha(a.createdAt).getTime());
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  function formatearFecha (dateTimeString) {
    const [dateString, timeString] = dateTimeString.split(' ');
    const [day, month, year] = dateString.split('/');
    const [hour, minute, second] = timeString.split(':');

    const dateObj = new Date(+year, +month - 1, +day, +hour, +minute, +second);
    return dateObj;
  }

  async function obtenerAdjunto (idInstrumento, instrumento) {
    try {
      const repository = await obtenerAdjuntoPorInstrumento(instrumento);
      const resultado = await repository.findById(idInstrumento);
      if (resultado && resultado.rutaDocumento) {
        const rutaDocumento = resultado.rutaDocumento;
        const doc = await readFile(rutaDocumento);
        return doc;
      } else {
        throw new Error('no existe el adjunto para el instrumento');
      }
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function obtenerAdjuntoFichaSeguimientoSocial (idAdjunto) {
    try {
      const resultado = await FichaSeguimientoSocialAdjuntoRepository.findById(idAdjunto);
      if (resultado && resultado.rutaDocumento) {
        const rutaDocumento = resultado.rutaDocumento;
        const doc = await readFile(rutaDocumento);
        return doc;
      } else {
        throw new Error('no existe el adjunto para el instrumento');
      }
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function obtenerAdjuntoFichaSocial (idAdjunto) {
    try {
      const resultado = await FichaSocialAdjuntoRepository.findById(idAdjunto);
      if (resultado && resultado.rutaDocumento) {
        const rutaDocumento = resultado.rutaDocumento;
        const doc = await readFile(rutaDocumento);
        return doc;
      } else {
        throw new Error('no existe el adjunto para el instrumento');
      }
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function obtenerAdjuntoFichaVisitaSocial (idAdjunto) {
    try {
      const resultado = await FichaVisitaSocialAdjuntoRepository.findById(idAdjunto);
      if (resultado && resultado.rutaDocumento) {
        const rutaDocumento = resultado.rutaDocumento;
        const doc = await readFile(rutaDocumento);
        return doc;
      } else {
        throw new Error('no existe el adjunto para el instrumento');
      }
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function obtenerAdjuntoDocumentoAsistenciaFamiliar (idAdjunto) {
    try {
      const resultado = await DocumentoAsistenciaFamiliarAdjuntoRepository.findById(idAdjunto);
      if (resultado && resultado.rutaDocumento) {
        const rutaDocumento = resultado.rutaDocumento;
        const doc = await readFile(rutaDocumento);
        return doc;
      } else {
        throw new Error('no existe el adjunto para el instrumento');
      }
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function obtenerAdjuntoPorInstrumento (instrumento) {
    if (instrumento === 'Ficha Psicologica' || instrumento === 'Ficha Psicológica') {
      return FichaPsicologicaRepository;
    } else if (instrumento === 'Ficha de Seguimiento Psicologico' || instrumento === 'Ficha de Seguimiento Psicológico') {
      return FichaSeguimientoPsicologicoRepository;
    } else if (instrumento === 'Informe Psicologico' || instrumento === 'Informe Psicológico') {
      return InformePsicologicoRepository;
    } else if (instrumento === 'Ficha de Seguimiento Social') {
      return FichaSeguimientoSocialRepository;
    } else if (instrumento === 'Ficha Social') {
      return FichaSocialRepository;
    } else if (instrumento === 'Ficha de Visita Social') {
      return FichaVisitaSocialRepository;
    } else if (instrumento === 'Informe Social') {
      return InformeSocialRepository;
    } else if (instrumento === 'Informe Legal') {
      return InformeLegalRepository;
    } else if (instrumento === 'Ficha de Seguimiento Legal') {
      return FichaSeguimientoLegalRepository;
    } else if (instrumento === 'Documento de Asistencia Familiar') {
      return DocumentoAsistenciaFamiliarRepository;
    } else if (instrumento === 'Memorial') {
      return MemorialRepository;
    } else if (instrumento === 'Terapia Externa') {
      return TerapiaExternaRepository;
    } else if (instrumento === 'Certificado Medico') {
      return CertificadoMedicoRepository;
    } else if (instrumento === 'Nota Externa') {
      return NotaExternaRepository;
    } else if (instrumento === 'Citacion') {
      return CitacionRepository;
    } else {
      throw new Error('no existe el instrumento');
    }
  }

  async function crearInterrupcionLegalEmbarazo (idDenuncia, data) {
    try {
      await verificarDenuncia(idDenuncia);
      data.idDenuncia = idDenuncia;

      const resultado = await InterrupcionLegalEmbarazoRepository.createOrUpdate(data);
      return resultado;
    } catch (error) {
      throw new ErrorApp(error.message, 400);
    }
  }

  async function obtenerInterrupcionLegalEmbarazo (id) {
    try {
      const resultado = await InterrupcionLegalEmbarazoRepository.findById(id);
      return resultado;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function listarInterrupcionLegalEmbarazo (idDenuncia) {
    try {
      const terapiasSlim = await InterrupcionLegalEmbarazoRepository.listar(idDenuncia);

      return terapiasSlim;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function generarInstrumentoPdf (codigo, id) {
    let file = null
    try {
      if(codigo === 'ILG-INL') {
        const resultado = await InformeLegalRepository.findById(id);
        const denuncia = await DenunciaRepository.buscarPorId(resultado.idDenuncia)
        const codigoRuv = denuncia.codigoRuv
        const nombreDistrito = denuncia.distritoDenuncia.nombre
        file = await makePdf('informe-legal.html', {...resultado, codigoRuv, nombreDistrito})
      }

      if(codigo === 'ILG-FSL') {
        const resultado = await FichaSeguimientoLegalRepository.findById(id);
        const denuncia = await DenunciaRepository.buscarPorId(resultado.idDenuncia)
        const codigoRuv = denuncia.codigoRuv
        const nombreDistrito = denuncia.distritoDenuncia.nombre
        file = await makePdf('ficha-seguimiento-legal.html', {...resultado, codigoRuv, nombreDistrito})
      }

      if(codigo === 'ISC-FSS') {
        const resultado = await FichaSeguimientoSocialRepository.findById(id);
        const denuncia = await DenunciaRepository.buscarPorId(resultado.idDenuncia)
        const codigoRuv = denuncia.codigoRuv
        const nombreDistrito = denuncia.distritoDenuncia.nombre
        file = await makePdf('ficha-seguimiento-social.html', {...resultado, codigoRuv, nombreDistrito})
      }

      if(codigo === 'ISC-INS') {
        const resultado = await InformeSocialRepository.findById(id);
        const denuncia = await DenunciaRepository.buscarPorId(resultado.idDenuncia)
        const codigoRuv = denuncia.codigoRuv
        const nombreDistrito = denuncia.distritoDenuncia.nombre
        file = await makePdf('informe-social.html', {...resultado, codigoRuv, nombreDistrito})
      }

      if(codigo === 'ISC-FVS') {
        const resultado = await FichaVisitaSocialRepository.findById(id);
        const denuncia = await DenunciaRepository.buscarPorId(resultado.idDenuncia)
        const codigoRuv = denuncia.codigoRuv
        const nombreDistrito = denuncia.distritoDenuncia.nombre
        file = await makePdf('ficha-visita-social.html', {...resultado, codigoRuv, nombreDistrito})
      }

      if(codigo === 'ISC-FSC') {
        const resultado = await FichaSocialRepository.findById(id);
        const denuncia = await DenunciaRepository.buscarPorId(resultado.idDenuncia)
        const codigoRuv = denuncia.codigoRuv
        const nombreDistrito = denuncia.distritoDenuncia.nombre
        file = await makePdf('ficha-social.html', {...resultado, codigoRuv, nombreDistrito})
      }

      if(codigo === 'IPS-IPS') {
        const resultado = await InformePsicologicoRepository.findById(id);
        const denuncia = await DenunciaRepository.buscarPorId(resultado.idDenuncia)
        const codigoRuv = denuncia.codigoRuv
        const nombreDistrito = denuncia.distritoDenuncia.nombre
        file = await makePdf('informe-psicologico.html', {...resultado, codigoRuv, nombreDistrito})
      }

      if(codigo === 'IPS-FSP') {
        const resultado = await FichaSeguimientoPsicologicoRepository.findById(id);
        const denuncia = await DenunciaRepository.buscarPorId(resultado.idDenuncia)
        const codigoRuv = denuncia.codigoRuv
        const nombreDistrito = denuncia.distritoDenuncia.nombre
        file = await makePdf('ficha-seguimiento-psicologico.html', {...resultado, codigoRuv, nombreDistrito})
      }

      if(codigo === 'IPS-FPS') {
        const resultado = await FichaPsicologicaRepository.findById(id);
        const denuncia = await DenunciaRepository.buscarPorId(resultado.idDenuncia)
        const codigoRuv = denuncia.codigoRuv
        const nombreDistrito = denuncia.distritoDenuncia.nombre
        file = await makePdf('ficha-psicologica.html', {...resultado, codigoRuv, nombreDistrito})
      }

      if(codigo === 'IPS-TSL') {
        const resultado = await TerapiaSlimRepository.findById(id);
        const denuncia = await DenunciaRepository.buscarPorId(resultado.idDenuncia)
        const codigoRuv = denuncia.codigoRuv
        const nombreDistrito = denuncia.distritoDenuncia.nombre
        const dia = resultado.fecha.split(' ')[0]
        const hora = resultado.fecha.split(' ')[1]
        file = await makePdf('ficha-terapia-slim.html', {...resultado, codigoRuv, nombreDistrito, dia, hora})
      }

      if(codigo === 'IGN-FCI') {
        const resultado = await CitacionRepository.findById(id);
        const denuncia = await DenunciaRepository.buscarPorId(resultado.idDenuncia)
        const codigoRuv = denuncia.codigoRuv
        const nombreDistrito = denuncia.distritoDenuncia.nombre

        const dia = resultado.paraDia.split(' ')[0]
        const hora = resultado.paraDia.split(' ')[1]
        file = await makePdf('ficha-formulario-citacion.html', {...resultado, codigoRuv, nombreDistrito, dia, hora})
      }

      if(codigo === 'IGN-TEX') {
        const resultado = await TerapiaExternaRepository.findById(id);
        const denuncia = await DenunciaRepository.buscarPorId(resultado.idDenuncia)
        const codigoRuv = denuncia.codigoRuv
        const nombreDistrito = denuncia.distritoDenuncia.nombre
        const nombreArchivo = resultado.rutaDocumento.split(/[/\\]/).pop();

        file = await makePdf('ficha-terapia-externa.html', {...resultado, codigoRuv, nombreDistrito, nombreArchivo})
      }

      return file;
    } catch (error) {
      throw new ErrorApp(error.message, 400);
    }
  }

  return {
    crearDocumentoAsistenciaFamiliar,
    crearFichaPsicologica,
    crearFichaSeguimientoLegal,
    crearFichaSeguimientoPsicologico,
    crearFichaSeguimientoSocial,
    crearFichaSocial,
    crearFichaVisitaSocial,
    crearInformeLegal,
    crearInformePsicologico,
    crearInformeSocial,
    crearMemorial,
    obtenerDocumentoAsistenciaFamiliar,
    obtenerFichaPsicologica,
    obtenerFichaSeguimientoLegal,
    obtenerFichaSeguimientoPsicologico,
    obtenerFichaSeguimientoSocial,
    obtenerFichaSocial,
    obtenerFichaVisitaSocial,
    obtenerInformeLegal,
    obtenerInformePsicologico,
    obtenerInformeSocial,
    obtenerMemorial,
    obtenerInstrumentos,
    obtenerAdjunto,
    crearInterrupcionLegalEmbarazo,
    obtenerInterrupcionLegalEmbarazo,
    listarInterrupcionLegalEmbarazo,
    adicionarAdjuntoDocumentoAsistenciaFamiliar,
    adicionarAdjuntoFichaSeguimientoSocial,
    adicionarAdjuntoFichaSocial,
    adicionarAdjuntoFichaVisitaSocial,
    obtenerAdjuntoFichaSeguimientoSocial,
    obtenerAdjuntoFichaSocial,
    obtenerAdjuntoFichaVisitaSocial,
    obtenerAdjuntoDocumentoAsistenciaFamiliar,
    generarInstrumentoPdf
  };
};
