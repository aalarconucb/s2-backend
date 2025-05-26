
const { Finalizado, HttpCodes } = require('../../../lib/globals');
const { Respuesta } = require('../../../lib/respuesta');
module.exports = function setupAsistenciaFamiliarController (services) {
  const { AsistenciaFamiliarService, UsuarioService } = services;

  async function crear (req, res) {
    try {
      const data = req.body;
      data.userCreated = req.user.idUsuario;
      const usuario = await UsuarioService.mostrar(data.userCreated)
      data.idDistrito = usuario.idDistrito
      const respuesta = await AsistenciaFamiliarService.crear(data);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function listar (req, res) {
    const userCreated = req.user.idUsuario;
    try {
      const usuario = await UsuarioService.mostrar(userCreated)
      const rol = usuario.roles.find(rol => rol.nombre === 'ADMINISTRADOR')
      if (rol) {
        req.query.idDistrito = usuario.idDistrito
      }

      const respuesta = await AsistenciaFamiliarService.listar(req.query)
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta))
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL))
    }
  }

  async function findById (req, res) {
    try {
      const { id } = req.params
      const respuesta = await AsistenciaFamiliarService.findById(id)
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta))
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL))
    }
  }

  async function actualizar (req, res) {
    try {
      const { idAsistenciaFamiliar } = req.params
      const data = req.body;
      data.userCreated = req.user.idUsuario;
      const respuesta = await AsistenciaFamiliarService.actualizar(idAsistenciaFamiliar, data);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function generarDocumento (req, res) {
    try {
      const idAsistenciaFamiliar = req.params.idAsistenciaFamiliar
      const respuesta = await AsistenciaFamiliarService.generarDocumento(idAsistenciaFamiliar)
      res.contentType('application/pdf')
      return res.send(respuesta)
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL))
    }
  }

  async function actualizarEstado (req, res) {
    try {
      const { idAsistenciaFamiliar } = req.params
      const data = req.body;
      data.userCreated = req.user.idUsuario;
      const respuesta = await AsistenciaFamiliarService.actualizarEstado(idAsistenciaFamiliar, data);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  return {
    crear,
    listar,
    findById,
    actualizar,
    generarDocumento,
    actualizarEstado
  };
};
