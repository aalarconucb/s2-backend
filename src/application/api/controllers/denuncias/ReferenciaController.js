
const { Finalizado, HttpCodes } = require('../../../lib/globals');
const { Respuesta } = require('../../../lib/respuesta');
module.exports = function setupReferenciaController (services) {
  const { ReferenciaService } = services;

  async function crearReferencia (req, res) {
    try {
      const data = req.body;
      data.userCreated = req.user.idUsuario;

      const { idDenuncia } = req.params;
      const respuesta = await ReferenciaService.crearReferencia(idDenuncia, data);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function obtenerReferencias (req, res) {
    try {
      const { idDenuncia } = req.params;
      const respuesta = await ReferenciaService.listarReferencias(idDenuncia);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function generarPdfReferencia (req, res) {
    try {
      const { idReferencia } = req.params;

      const respuesta = await ReferenciaService.generarPdfReferencia(idReferencia);

      res.contentType('application/pdf');
      return res.send(respuesta);
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function crearContraReferencia (req, res) {
    try {
      const data = req.body;
      data.userCreated = req.user.idUsuario;

      const { idDenuncia } = req.params;
      const respuesta = await ReferenciaService.crearContraReferencia(idDenuncia, data);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function obtenerContraReferencias (req, res) {
    try {
      const { idDenuncia } = req.params;
      const respuesta = await ReferenciaService.listarContraReferencias(idDenuncia);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function generarPdfContraReferencia (req, res) {
    try {
      const { idContraReferencia } = req.params;

      const respuesta = await ReferenciaService.generarPdfContraReferencia(idContraReferencia);

      res.contentType('application/pdf');
      return res.send(respuesta);
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function obtenerReferencia (req, res) {
    try {
      const { idReferencia } = req.params;

      const respuesta = await ReferenciaService.obtenerReferencia(idReferencia);

      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function obtenerContraReferencia (req, res) {
    try {
      const { idContraReferencia } = req.params;

      const respuesta = await ReferenciaService.obtenerContraReferencia(idContraReferencia);

      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function obtenerAdjuntoContraReferencia (req, res) {
    try {
      const { idContraReferencia } = req.params;
      const adjunto = await ReferenciaService.obtenerAdjuntoContraReferencia(idContraReferencia);

      // res.contentType('application/pdf');
      return res.send(adjunto);
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  return {
    crearReferencia,
    obtenerReferencias,
    generarPdfReferencia,
    crearContraReferencia,
    obtenerContraReferencias,
    generarPdfContraReferencia,
    obtenerReferencia,
    obtenerContraReferencia,
    obtenerAdjuntoContraReferencia
  };
};
