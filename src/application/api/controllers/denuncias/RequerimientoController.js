
const { Finalizado, HttpCodes } = require('../../../lib/globals');
const { Respuesta } = require('../../../lib/respuesta');
module.exports = function setupRequerimientoController (services) {
  const { RequerimientoService } = services;

  async function crear (req, res) {
    try {
      const data = req.body;
      data.userCreated = req.user.idUsuario;
      const datosUsuario = req.user;
      const respuesta = await RequerimientoService.crear(datosUsuario, data);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function obtener (req, res) {
    try {
      const { id } = req.params;
      const respuesta = await RequerimientoService.obtener(id);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function listar (req, res) {
    try {
      const datosUsuario = req.user;
      const respuesta = await RequerimientoService.listar(datosUsuario, req.query);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function obtenerAdjunto (req, res) {
    try {
      const { id } = req.params;
      const adjunto = await RequerimientoService.obtenerAdjunto(id);

      res.contentType('application/pdf');
      return res.send(adjunto);
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function obtenerDocumento (req, res) {
    try {
      const id = req.params.id
      const respuesta = await RequerimientoService.obtenerDocumento(id)
      res.contentType('application/pdf')
      return res.send(respuesta)
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL))
    }
  }

  async function reporteFechas(req, res) {
    try {
      const datosUsuario = req.user
      const respuesta = await RequerimientoService.reporteFechas(datosUsuario, req.query)
      if (respuesta && respuesta.length > 0) {
        res.contentType('text/csv')
        return res.send(respuesta)
      } else {
        throw new Error('No existen resultados para esos rangos de fechas');
      }
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL))
    }
  }

  return {
    crear,
    obtener,
    listar,
    obtenerAdjunto,
    obtenerDocumento,
    reporteFechas
  };
};
