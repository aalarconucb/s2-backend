'use strict';
const debug = require('debug')('app:controller:REPORTE');
const { Respuesta } = require('../../../lib/respuesta');
const { Finalizado, HttpCodes } = require('../../../lib/globals');

module.exports = function setupMenuController (services) {
  const { MenuService } = services;

  async function listar (req, res) {
    try {
      debug('Recuperando modulos');
      const respuesta = await MenuService.listar(req.query);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function crear (req, res) {
    try {
      const datos = req.body;
      datos.userCreated = req.user.idUsuario;
      const respuesta = await MenuService.createOrUpdate(datos);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function actualizar (req, res) {
    try {
      const datos = req.body;
      datos.userUpdated = req.user.idUsuario;
      datos.id = req.params.id;
      const respuesta = await MenuService.createOrUpdate(datos);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function eliminar (req, res) {
    try {
      const respuesta = await MenuService.eliminar({
        id          : req.params.id,
        userDeleted : req.user.idUsuario
      });
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function mostrar (req, res) {
    try {
      debug('Recuperando modulos');
      const respuesta = await MenuService.findOne({ id: req.params.id });
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  return {
    crear,
    actualizar,
    eliminar,
    listar,
    mostrar
  };
};
