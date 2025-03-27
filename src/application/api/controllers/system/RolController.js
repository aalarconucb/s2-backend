
'use strict';
const debug = require('debug')('app:controller:REPORTE');
const { Respuesta } = require('../../../lib/respuesta');
const { Finalizado, HttpCodes } = require('../../../lib/globals');

module.exports = function setupRolController (services) {
  const {
    RolService
  } = services;

  async function listar (req, res) {
    try {
      debug('Recuperando roles');
      const respuesta = await RolService.findAll(req.query);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function listarPermisos (req, res) {
    try {
      const { id } = req.params;
      const respuesta = await RolService.listarPermisos(id);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function findOne (req, res) {
    try {
      const data = { id: req.params.id };
      const respuesta = await RolService.findOne(data);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function recuperarPorId (req, res) {
    try {
      const { id } = req.params;
      debug('Recuperando rol');
      const respuesta = await RolService.findById(id);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }
  async function eliminar (req, res) {
    try {
      const { id } = req.params;
      debug('Eliminando rol');
      const respuesta = await RolService.deleteItem(id);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }
  async function crear (req, res) {
    try {
      const data = req.body;
      debug('creando rol');
      data.userCreated = req.user.idUsuario;
      const respuesta = await RolService.createOrUpdate(data);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function actualizar (req, res) {
    try {
      debug('actualizando rol');
      const data = req.body;
      data.id = req.params.id;
      data.userUpdated = req.user.idUsuario;
      const respuesta = await RolService.createOrUpdate(data);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }
  return {
    findOne,
    listarPermisos,
    listar,
    recuperarPorId,
    eliminar,
    actualizar,
    crear
  };
};
