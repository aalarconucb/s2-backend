
const { Finalizado, HttpCodes } = require('../../../lib/globals');
const { Respuesta } = require('../../../lib/respuesta');
module.exports = function setupInstrumentoController (services) {
  const { InstrumentoService } = services;

  async function crearDocumentoAsistenciaFamiliar (req, res) {
    try {
      const data = req.body;
      const { idDenuncia } = req.params;
      data.userCreated = req.user.idUsuario;
      const respuesta = await InstrumentoService.crearDocumentoAsistenciaFamiliar(idDenuncia, data);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function adicionarAdjuntoDocumentoAsistenciaFamiliar (req, res) {
    try {
      const data = req.body;
      const { idInstrumento } = req.params;
      data.userCreated = req.user.idUsuario;
      const respuesta = await InstrumentoService.adicionarAdjuntoDocumentoAsistenciaFamiliar(idInstrumento, data);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function crearFichaPsicologica (req, res) {
    try {
      const data = req.body;
      const { idDenuncia } = req.params;
      data.userCreated = req.user.idUsuario;
      const respuesta = await InstrumentoService.crearFichaPsicologica(idDenuncia, data);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function crearFichaSeguimientoLegal (req, res) {
    try {
      const data = req.body;
      const { idDenuncia } = req.params;
      data.userCreated = req.user.idUsuario;
      const respuesta = await InstrumentoService.crearFichaSeguimientoLegal(idDenuncia, data);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function crearFichaSeguimientoPsicologico (req, res) {
    try {
      const data = req.body;
      const { idDenuncia } = req.params;
      data.userCreated = req.user.idUsuario;
      const respuesta = await InstrumentoService.crearFichaSeguimientoPsicologico(idDenuncia, data);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function crearFichaSeguimientoSocial (req, res) {
    try {
      const data = req.body;
      const { idDenuncia } = req.params;
      data.userCreated = req.user.idUsuario;
      const respuesta = await InstrumentoService.crearFichaSeguimientoSocial(idDenuncia, data);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function adicionarAdjuntoFichaSeguimientoSocial (req, res) {
    try {
      const data = req.body;
      const { idInstrumento } = req.params;
      data.userCreated = req.user.idUsuario;
      const respuesta = await InstrumentoService.adicionarAdjuntoFichaSeguimientoSocial(idInstrumento, data);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function crearFichaSocial (req, res) {
    try {
      const data = req.body;
      const { idDenuncia } = req.params;
      data.userCreated = req.user.idUsuario;
      const respuesta = await InstrumentoService.crearFichaSocial(idDenuncia, data);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function adicionarAdjuntoFichaSocial (req, res) {
    try {
      const data = req.body;
      const { idInstrumento } = req.params;
      data.userCreated = req.user.idUsuario;
      const respuesta = await InstrumentoService.adicionarAdjuntoFichaSocial(idInstrumento, data);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function crearFichaVisitaSocial (req, res) {
    try {
      const data = req.body;
      const { idDenuncia } = req.params;
      data.userCreated = req.user.idUsuario;
      const respuesta = await InstrumentoService.crearFichaVisitaSocial(idDenuncia, data);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function adicionarAdjuntoFichaVisitaSocial (req, res) {
    try {
      const data = req.body;
      const { idInstrumento } = req.params;
      data.userCreated = req.user.idUsuario;
      const respuesta = await InstrumentoService.adicionarAdjuntoFichaVisitaSocial(idInstrumento, data);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function crearInformeLegal (req, res) {
    try {
      const data = req.body;
      const { idDenuncia } = req.params;
      data.userCreated = req.user.idUsuario;
      const respuesta = await InstrumentoService.crearInformeLegal(idDenuncia, data);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function crearInformePsicologico (req, res) {
    try {
      const data = req.body;
      const { idDenuncia } = req.params;
      data.userCreated = req.user.idUsuario;
      const respuesta = await InstrumentoService.crearInformePsicologico(idDenuncia, data);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function crearInformeSocial (req, res) {
    try {
      const data = req.body;
      const { idDenuncia } = req.params;
      data.userCreated = req.user.idUsuario;
      const respuesta = await InstrumentoService.crearInformeSocial(idDenuncia, data);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function crearMemorial (req, res) {
    try {
      const data = req.body;
      const { idDenuncia } = req.params;
      data.userCreated = req.user.idUsuario;
      const respuesta = await InstrumentoService.crearMemorial(idDenuncia, data);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function obtenerDocumentoAsistenciaFamiliar (req, res) {
    try {
      const { idInstrumento } = req.params;
      const respuesta = await InstrumentoService.obtenerDocumentoAsistenciaFamiliar(idInstrumento);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function obtenerFichaPsicologica (req, res) {
    try {
      const { idInstrumento } = req.params;
      const respuesta = await InstrumentoService.obtenerFichaPsicologica(idInstrumento);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function obtenerFichaSeguimientoLegal (req, res) {
    try {
      const { idInstrumento } = req.params;
      const respuesta = await InstrumentoService.obtenerFichaSeguimientoLegal(idInstrumento);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function obtenerFichaSeguimientoPsicologico (req, res) {
    try {
      const { idInstrumento } = req.params;
      const respuesta = await InstrumentoService.obtenerFichaSeguimientoPsicologico(idInstrumento);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function obtenerFichaSeguimientoSocial (req, res) {
    try {
      const { idInstrumento } = req.params;
      const respuesta = await InstrumentoService.obtenerFichaSeguimientoSocial(idInstrumento);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function obtenerFichaSocial (req, res) {
    try {
      const { idInstrumento } = req.params;
      const respuesta = await InstrumentoService.obtenerFichaSocial(idInstrumento);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function obtenerFichaVisitaSocial (req, res) {
    try {
      const { idInstrumento } = req.params;
      const respuesta = await InstrumentoService.obtenerFichaVisitaSocial(idInstrumento);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function obtenerInformeLegal (req, res) {
    try {
      const { idInstrumento } = req.params;
      const respuesta = await InstrumentoService.obtenerInformeLegal(idInstrumento);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function obtenerInformePsicologico (req, res) {
    try {
      const { idInstrumento } = req.params;
      const respuesta = await InstrumentoService.obtenerInformePsicologico(idInstrumento);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function obtenerInformeSocial (req, res) {
    try {
      const { idInstrumento } = req.params;
      const respuesta = await InstrumentoService.obtenerInformeSocial(idInstrumento);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function obtenerMemorial (req, res) {
    try {
      const { idInstrumento } = req.params;
      const respuesta = await InstrumentoService.obtenerMemorial(idInstrumento);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function obtenerInstrumentos (req, res) {
    try {
      const { idDenuncia } = req.params;
      const respuesta = await InstrumentoService.obtenerInstrumentos(idDenuncia);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function obtenerAdjunto (req, res) {
    try {
      const { idInstrumento } = req.params;
      const { instrumento } = req.query;
      const adjunto = await InstrumentoService.obtenerAdjunto(idInstrumento, instrumento);
      // return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));

      res.contentType('application/pdf');
      return res.send(adjunto);
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function obtenerAdjuntoFichaSeguimientoSocial (req, res) {
    try {
      const { idAdjunto } = req.params;
      const adjunto = await InstrumentoService.obtenerAdjuntoFichaSeguimientoSocial(idAdjunto);

      // res.contentType('application/pdf');
      return res.send(adjunto);
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function obtenerAdjuntoFichaSocial (req, res) {
    try {
      const { idAdjunto } = req.params;
      const adjunto = await InstrumentoService.obtenerAdjuntoFichaSocial(idAdjunto);

      // res.contentType('application/pdf');
      return res.send(adjunto);
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function obtenerAdjuntoFichaVisitaSocial (req, res) {
    try {
      const { idAdjunto } = req.params;
      const adjunto = await InstrumentoService.obtenerAdjuntoFichaVisitaSocial(idAdjunto);

      // res.contentType('application/pdf');
      return res.send(adjunto);
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function obtenerAdjuntoDocumentoAsistenciaFamiliar (req, res) {
    try {
      const { idAdjunto } = req.params;
      const adjunto = await InstrumentoService.obtenerAdjuntoDocumentoAsistenciaFamiliar(idAdjunto);

      // res.contentType('application/pdf');
      return res.send(adjunto);
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function crearInterrupcionLegalEmbarazo (req, res) {
    try {
      const data = req.body;
      const { idDenuncia } = req.params;
      data.userCreated = req.user.idUsuario;
      const respuesta = await InstrumentoService.crearInterrupcionLegalEmbarazo(idDenuncia, data);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function obtenerInterrupcionLegalEmbarazo (req, res) {
    try {
      const { idInstrumento } = req.params;
      const respuesta = await InstrumentoService.obtenerInterrupcionLegalEmbarazo(idInstrumento);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function listarInterrupcionLegalEmbarazo (req, res) {
    try {
      const { idDenuncia } = req.params;
      const respuesta = await InstrumentoService.listarInterrupcionLegalEmbarazo(idDenuncia);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function generarInstrumentoPdf (req, res) {
    try {
      const codigoInstrumento = req.params.codigoInstrumento
      const idInstrumento = req.params.idInstrumento
      const respuesta = await InstrumentoService.generarInstrumentoPdf(codigoInstrumento, idInstrumento)
      res.contentType('application/pdf')
      return res.send(respuesta)
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL))
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
