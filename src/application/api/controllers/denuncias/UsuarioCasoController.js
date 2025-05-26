
const { Finalizado, HttpCodes } = require('../../../lib/globals');
const { Respuesta } = require('../../../lib/respuesta');
module.exports = function setupUsuarioCasoController (services) {
  const { UsuarioCasoService } = services;

  async function listarAsignados (req, res) {
    try {
      const { idUsuario } = req.user;
      const respuesta = await UsuarioCasoService.listarAsignados(idUsuario);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function listarSeguimiento(req, res) {
    try {
      const {idUsuario } = req.user
      const respuesta = await UsuarioCasoService.listarSeguimiento(idUsuario)
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta))
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL))
    }
  }

  async function resumenDistrito (req, res) {
    try {
      const datosUsuario = req.user;
      const respuesta = await UsuarioCasoService.resumenDistrito(datosUsuario);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  return {
    listarAsignados,
    listarSeguimiento,
    resumenDistrito
  };
};
