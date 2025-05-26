
const { Finalizado, HttpCodes } = require('../../../lib/globals');
const { Respuesta } = require('../../../lib/respuesta');
module.exports = function setupTerapiaController (services) {
  const { TerapiaService } = services;

  async function crearTerapiaSlim (req, res) {
    try {
      const data = req.body;
      const { idDenuncia } = req.params;
      data.userCreated = req.user.idUsuario;
      const respuesta = await TerapiaService.crearTerapiaSlim(idDenuncia, data);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function obtenerTerapiaSlim (req, res) {
    try {
      const { idInstrumento } = req.params;
      const respuesta = await TerapiaService.obtenerTerapiaSlim(idInstrumento);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function listarTerapiasSlim (req, res) {
    try {
      const { idDenuncia } = req.params;
      const respuesta = await TerapiaService.listarTerapiasSlim(idDenuncia);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function crearTerapiaExterna (req, res) {
    try {
      const data = req.body;
      const { idDenuncia } = req.params;
      data.userCreated = req.user.idUsuario;
      const respuesta = await TerapiaService.crearTerapiaExterna(idDenuncia, data);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function obtenerTerapiaExterna (req, res) {
    try {
      const { idInstrumento } = req.params;
      const respuesta = await TerapiaService.obtenerTerapiaExterna(idInstrumento);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function listarTerapiasExternas (req, res) {
    try {
      const { idDenuncia } = req.params;
      const respuesta = await TerapiaService.listarTerapiasExternas(idDenuncia);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function obtenerAdjunto (req, res) {
    try {
      const { idInstrumento } = req.params;
      const adjunto = await TerapiaService.obtenerAdjunto(idInstrumento);

      res.contentType('application/pdf');
      return res.send(adjunto);
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function crearCertificadoMedico (req, res) {
    try {
      const data = req.body;
      const { idDenuncia } = req.params;
      data.userCreated = req.user.idUsuario;
      const respuesta = await TerapiaService.crearCertificadoMedico(idDenuncia, data);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function obtenerCertificadoMedico (req, res) {
    try {
      const { idInstrumento } = req.params;
      const respuesta = await TerapiaService.obtenerCertificadoMedico(idInstrumento);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function listarCertificadosMedicos (req, res) {
    try {
      const { idDenuncia } = req.params;
      const respuesta = await TerapiaService.listarCertificadosMedicos(idDenuncia);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function obtenerAdjuntoCertificadoMedico (req, res) {
    try {
      const { idInstrumento } = req.params;
      const adjunto = await TerapiaService.obtenerAdjuntoCertificadoMedico(idInstrumento);

      res.contentType('application/pdf');
      return res.send(adjunto);
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function crearNotaExterna (req, res) {
    try {
      const data = req.body;
      const { idDenuncia } = req.params;
      data.userCreated = req.user.idUsuario;
      const respuesta = await TerapiaService.crearNotaExterna(idDenuncia, data);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function obtenerNotaExterna (req, res) {
    try {
      const { idInstrumento } = req.params;
      const respuesta = await TerapiaService.obtenerNotaExterna(idInstrumento);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function listarNotasExternas (req, res) {
    try {
      const { idDenuncia } = req.params;
      const respuesta = await TerapiaService.listarNotasExternas(idDenuncia);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function obtenerAdjuntoNotaExterna (req, res) {
    try {
      const { idInstrumento } = req.params;
      const adjunto = await TerapiaService.obtenerAdjuntoNotaExterna(idInstrumento);

      res.contentType('application/pdf');
      return res.send(adjunto);
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function crearCitacion (req, res) {
    try {
      const data = req.body;
      const { idDenuncia } = req.params;
      data.userCreated = req.user.idUsuario;
      const respuesta = await TerapiaService.crearCitacion(idDenuncia, data);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function obtenerCitacion (req, res) {
    try {
      const { idInstrumento } = req.params;
      const respuesta = await TerapiaService.obtenerCitacion(idInstrumento);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function listarCitaciones (req, res) {
    try {
      const { idDenuncia } = req.params;
      const respuesta = await TerapiaService.listarCitaciones(idDenuncia);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  // async function crearRequerimientoFiscal (req, res) {
  //   try {
  //     const data = req.body;
  //     data.userCreated = req.user.idUsuario;
  //     const datosUsuario = req.user;
  //     const respuesta = await TerapiaService.crearRequerimientoFiscal(datosUsuario, data);
  //     return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
  //   } catch (error) {
  //     return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
  //   }
  // }

  // async function obtenerRequerimientoFiscal (req, res) {
  //   try {
  //     const { idRequerimientoFiscal } = req.params;
  //     const respuesta = await TerapiaService.obtenerNotaExterna(idRequerimientoFiscal);
  //     return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
  //   } catch (error) {
  //     return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
  //   }
  // }

  // async function listarRequerimientosFiscales (req, res) {
  //   try {
  //     const datosUsuario = req.user;
  //     const respuesta = await TerapiaService.listarRequerimientosFiscales(datosUsuario);
  //     return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
  //   } catch (error) {
  //     return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
  //   }
  // }

  // async function obtenerAdjuntoRequerimientoFiscal (req, res) {
  //   try {
  //     const { idRequerimientoFiscal } = req.params;
  //     const adjunto = await TerapiaService.obtenerAdjuntoRequerimientoFiscal(idRequerimientoFiscal);

  //     res.contentType('application/pdf');
  //     return res.send(adjunto);
  //   } catch (error) {
  //     return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
  //   }
  // }

  return {
    crearTerapiaSlim,
    obtenerTerapiaSlim,
    listarTerapiasSlim,
    crearTerapiaExterna,
    obtenerTerapiaExterna,
    listarTerapiasExternas,
    obtenerAdjunto,
    crearCertificadoMedico,
    obtenerCertificadoMedico,
    listarCertificadosMedicos,
    obtenerAdjuntoCertificadoMedico,
    crearNotaExterna,
    obtenerNotaExterna,
    listarNotasExternas,
    obtenerAdjuntoNotaExterna,
    crearCitacion,
    obtenerCitacion,
    listarCitaciones,
    // crearRequerimientoFiscal,
    // obtenerRequerimientoFiscal,
    // listarRequerimientosFiscales,
    // obtenerAdjuntoRequerimientoFiscal
  };
};
