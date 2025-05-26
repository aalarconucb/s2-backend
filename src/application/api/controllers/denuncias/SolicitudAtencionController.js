
const { Finalizado, HttpCodes } = require('../../../lib/globals');
const { Respuesta } = require('../../../lib/respuesta');
module.exports = function setupSolicitudAtencionController (services) {
  const { SolicitudAtencionService } = services;

  async function crear (req, res) {
    try {
      const data = req.body;
      data.userCreated = req.user.idUsuario;

      const { idDenuncia } = req.params;
      const respuesta = await SolicitudAtencionService.crear(idDenuncia, data);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function obtenerSolicitudesPorDenuncia (req, res) {
    try {
      const { idDenuncia } = req.params;
      const respuesta = await SolicitudAtencionService.obtenerSolicitudesPorDenuncia(idDenuncia);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function obtenerSolicitudes (req, res) {
    try {
      const datosUsuario = req.user;
      console.log("🚀 ~ obtenerSolicitudes ~ datosUsuario:", datosUsuario)
      const respuesta = await SolicitudAtencionService.listar(datosUsuario);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  return {
    crear,
    obtenerSolicitudesPorDenuncia,
    obtenerSolicitudes
  };
};
