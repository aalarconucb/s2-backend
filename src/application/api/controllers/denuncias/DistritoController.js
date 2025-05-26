
const { Finalizado, HttpCodes } = require('../../../lib/globals');
const { Respuesta } = require('../../../lib/respuesta');
module.exports = function setupDistritoController (services) {
  const { DistritoService } = services;

  async function crear (req, res) {
    try {
      const data = req.body;
      const { idMunicipio } = req.params;
      data.userCreated = req.user.idUsuario;
      const respuesta = await DistritoService.createOrUpdate(idMunicipio, data);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function actualizar (req, res) {
    try {
      const data = req.body;
      const { idDistrito } = req.params;
      data.userCreated = req.user.idUsuario;
      const respuesta = await DistritoService.actualizar(idDistrito, data);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function obtenerInformacionDistrito (req, res) {
    try {
      const { idDistrito } = req.params;
      const respuesta = await DistritoService.obtenerInformacionDistrito(idDistrito);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function obtenerReporte (req, res) {
    try {
      const respuesta = await DistritoService.obtenerReporte();
      res.contentType('text/csv');
      return res.send(respuesta);
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function listar (req, res) {
    try {
      const respuesta = await DistritoService.listar(req.query);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  return {
    crear,
    actualizar,
    obtenerInformacionDistrito,
    obtenerReporte,
    listar
  };
};
