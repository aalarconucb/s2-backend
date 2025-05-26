
const { Finalizado, HttpCodes } = require('../../../lib/globals');
const { Respuesta } = require('../../../lib/respuesta');
module.exports = function setupMunicipioController (services) {
  const { MunicipioService } = services;

  async function crear (req, res) {
    try {
      const data = req.body;
      data.userCreated = req.user.idUsuario;
      const respuesta = await MunicipioService.createOrUpdate(data);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function actualizar (req, res) {
    try {
      const datos = req.body;
      datos.userUpdated = req.user.idUsuario;
      const id = req.params.id;

      const respuesta = await MunicipioService.actualizar(id, datos);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function obtenerMunicipios (req, res) {
    try {
      const { codigoProvincia } = req.params;
      const respuesta = await MunicipioService.obtenerMunicipios(codigoProvincia);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function obtenerMunicipiosPorRed (req, res) {
    try {
      const { idRed } = req.params;
      const respuesta = await MunicipioService.obtenerMunicipiosPorRed(idRed);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function obtenerDistritos (req, res) {
    try {
      const { idMunicipio } = req.params;
      const respuesta = await MunicipioService.obtenerDistritos(idMunicipio);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function obtenerProfesionales (req, res) {
    try {
      const { idDistrito } = req.params;
      const respuesta = await MunicipioService.obtenerProfesionales(idDistrito);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function obtenerUsuarios (req, res) {
    try {
      const respuesta = await MunicipioService.obtenerUsuarios(req.query);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function obtenerLogo (req, res) {
    try {
      const { idMunicipio } = req.params;
      const adjunto = await MunicipioService.obtenerLogo(idMunicipio);

      // res.contentType('application/pdf');
      return res.send(adjunto);
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function obtenerMunicipio (req, res) {
    try {
      const { idMunicipio } = req.params;
      const respuesta = await MunicipioService.obtenerMunicipio(idMunicipio);

      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function listar (req, res) {
    try {
      const respuesta = await MunicipioService.listar(req.query);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function obtenerMunicipiosPorDepartamento (req, res) {
    try {
      const { codigoDepartamento } = req.params;
      const respuesta = await MunicipioService.obtenerMunicipiosPorDepartamento(codigoDepartamento);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  return {
    crear,
    obtenerMunicipios,
    obtenerMunicipiosPorRed,
    obtenerDistritos,
    obtenerProfesionales,
    obtenerUsuarios,
    obtenerLogo,
    obtenerMunicipio,
    listar,
    actualizar,
    obtenerMunicipiosPorDepartamento
  };
};
