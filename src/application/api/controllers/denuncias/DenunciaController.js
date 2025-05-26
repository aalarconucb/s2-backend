
const { Finalizado, HttpCodes } = require('../../../lib/globals');
const { Respuesta } = require('../../../lib/respuesta');
module.exports = function setupDenunciaController (services) {
  const { DenunciaService, UsuarioService } = services;

  async function crear (req, res) {
    try {
      const data = req.body;
      const { idDistrito } = req.params;
      data.userCreated = req.user.idUsuario;
      const respuesta = await DenunciaService.createOrUpdate(idDistrito, data);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function actualizar (req, res) {
    try {
      const { idDenuncia } = req.params;
      const data = req.body;

      data.userUpdated = req.user.idUsuario;
      const respuesta = await DenunciaService.actualizar(idDenuncia, data);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function generarPdf (req, res) {
    try {
      const { idDenuncia } = req.params;
      const respuesta = await DenunciaService.generarPdf(idDenuncia);
      res.contentType('application/pdf');
      return res.send(respuesta);
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function buscarPorNumeroDocumento (req, res) {
    try {
      const { nroDocumento } = req.query;

      const respuesta = await DenunciaService.buscarPorNumeroDocumento(nroDocumento);

      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function listarDenuncias (req, res) {
    try {
      const respuesta = await DenunciaService.listarDenuncias(req.query);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function listarDenunciasPorRol (req, res) {
    console.log("🚀 ~ listarDenunciasPorRol ~ req.query:", req.query)
    try {
      const datosUsuario = req.user;
      const respuesta = await DenunciaService.listarDenunciasPorRol(datosUsuario, req.query);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function listarDenunciasPorUsuario (req, res) {
    try {
      const datosUsuario = req.user;
      const respuesta = await DenunciaService.listarDenunciasPorUsuario(datosUsuario, req.query);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function obtenerDenuncia (req, res) {
    try {
      const { idDenuncia } = req.params;
      const respuesta = await DenunciaService.obtenerDenuncia(idDenuncia);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function buscarPersona (req, res) {
    try {
      const { nroDocumento } = req.query;
      const respuesta = await DenunciaService.buscarPersona(nroDocumento);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function buscarVictimaHistorial (req, res) {
    try {
      const { idDenuncia } = req.params;
      const respuesta = await DenunciaService.buscarVictimaHistorial(idDenuncia);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function buscarDenunciadoHistorial (req, res) {
    try {
      const { idDenuncia } = req.params;
      const respuesta = await DenunciaService.buscarDenunciadoHistorial(idDenuncia);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function asignarProfesional (req, res) {
    try {
      const data = req.body;
      const { idDenuncia } = req.params;
      data.userCreated = req.user.idUsuario;
      const respuesta = await DenunciaService.asignarProfesional(idDenuncia, data);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function actualizarEstadoDenuncia (req, res) {
    try {
      const data = req.body;
      const { idDenuncia } = req.params;
      data.userCreated = req.user.idUsuario;
      const respuesta = await DenunciaService.actualizarEstadoDenuncia(idDenuncia, data);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function obtenerAdjunto (req, res) {
    try {
      const { idDenuncia } = req.params;

      const respuesta = await DenunciaService.obtenerAdjunto(idDenuncia);

      res.contentType('application/pdf');
      return res.send(respuesta);
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function generarReporteDetalle (req, res) {
    try {
      const { tipo } = req.query;
      const datosUsuario = req.user;
      const respuesta = await DenunciaService.generarReporteDetalle(req.query, datosUsuario, tipo);
      console.log('res', respuesta);
      if (tipo === 'csv') {
        res.contentType('text/csv');
        return res.send(respuesta);
      } else if (tipo === 'pdf') {
        res.contentType('application/pdf');
        return res.send(respuesta);
      } else {
        return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
      }
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function generarReporteEstadistico (req, res) {
    try {
      const { tipo } = req.query;
      const datosUsuario = req.user;
      const respuesta = await DenunciaService.generarReporteEstadistico(req.query, datosUsuario, tipo);
      if (tipo === 'csv') {
        res.contentType('text/csv');
        return res.send(respuesta);
      } else {
        return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
      }
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function generarReporteGeneral (req, res) {
    try {
      const { tipo } = req.query;
      const respuesta = await DenunciaService.generarReporteGeneral(req.query);
      if (tipo === 'csv') {
        res.contentType('text/csv');
        return res.send(respuesta);
      } else {
        return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
      }
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function asignarCaso (req, res) {
    try {
      const { idDenuncia, idUsuario } = req.params;
      const datosUsuario = req.user;
      const respuesta = await DenunciaService.asignarCaso(idDenuncia, idUsuario, datosUsuario);

      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function crearTransferencia (req, res) {
    try {
      const { idDenuncia } = req.params;
      const datosTransferencia = req.body;
      const datosUsuario = req.user;
      const respuesta = await DenunciaService.crearTransferencia(idDenuncia, datosTransferencia, datosUsuario);

      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  //
  async function listarParaAsistencia (req, res) {
    try {
      const datosUsuario = req.user;
      const respuesta = await DenunciaService.listarParaAsistencia(datosUsuario, req.query);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function cuadroInformativo (req, res) {
    try {
      const { idDistrito } = req.params;
      const respuesta = await DenunciaService.cuadroInformativo(idDistrito);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function generarReporteRegion (req, res) {
    const { fechaInicio, fechaFin, codigoDepartamento, codigoMunicipio } = req.query
    if (!fechaInicio || !fechaFin) {
      throw new ErrorApp('El rango de fechas es obligatorio', 400);
    }

    if (new Date(fechaInicio) > new Date(fechaFin)) {
      throw new ErrorApp('La fecha de inicio debe ser anterior o igual a la fecha de fin', 400);
    }

    try {
      const datosUsuario = req.user;
      const usuario = await UsuarioService.mostrar(datosUsuario.idUsuario)
      let respuesta

      if (codigoDepartamento && codigoMunicipio) {
        respuesta = await DenunciaService.generarReporteMunicipal(req.query, usuario)
      } else if (codigoDepartamento) {
        respuesta = await DenunciaService.generarReporteDepartamental(req.query, usuario)
      } else {
        respuesta = await DenunciaService.generarReporteNacional(req.query, usuario)
      }

      res.contentType('application/pdf')
      return res.send(respuesta)
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  return {
    crear,
    actualizar,
    generarPdf,
    buscarPorNumeroDocumento,
    listarDenuncias,
    buscarPersona,
    buscarVictimaHistorial,
    buscarDenunciadoHistorial,
    obtenerDenuncia,
    asignarProfesional,
    listarDenunciasPorRol,
    listarDenunciasPorUsuario,
    actualizarEstadoDenuncia,
    obtenerAdjunto,
    generarReporteDetalle,
    generarReporteEstadistico,
    generarReporteGeneral,
    asignarCaso,
    crearTransferencia,
    listarParaAsistencia,
    cuadroInformativo,
    generarReporteRegion
  };
};
