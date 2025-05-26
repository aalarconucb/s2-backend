
const { Finalizado, HttpCodes } = require('../../../lib/globals');
const { Respuesta } = require('../../../lib/respuesta');

module.exports = function setupOrientacionController (services) {
  const { OrientacionService } = services;

  async function crearOrientacion (req, res) {
    try {
      const data = req.body;
      data.userCreated = req.user.idUsuario;
      const datosUsuario = req.user;
      const respuesta = await OrientacionService.crearOrientacion(datosUsuario, data);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function obtenerOrientacion (req, res) {
    try {
      const { id } = req.params;
      const respuesta = await OrientacionService.obtenerOrientacion(id);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function listarOrientaciones (req, res) {
    try {
      const datosUsuario = req.user;
      const respuesta = await OrientacionService.listarOrientaciones(datosUsuario, req.query);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function obtenerReporteOrientaciones (req, res) {
    try {
      const datosUsuario = req.user;
      const respuesta = await OrientacionService.obtenerReporteOrientaciones(datosUsuario, req.query);
      if (respuesta && respuesta.length > 0) {
        res.contentType('text/csv');
        return res.send(respuesta);
      } else {
        throw new Error('No existen resultados para esos rangos de fechas');
      }
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function generarPdf (req, res) {
    try {
      const id = req.params.id
      const respuesta = await OrientacionService.generarPdf(id)
      res.contentType('application/pdf')
      return res.send(respuesta)
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL))
    }
  }

  return {
    crearOrientacion,
    obtenerOrientacion,
    listarOrientaciones,
    obtenerReporteOrientaciones,
    generarPdf
  };
};
