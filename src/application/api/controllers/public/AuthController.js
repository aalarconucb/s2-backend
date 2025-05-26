'use strict';

const debug = require('debug')('app:controller:auth');
const { Respuesta } = require('../../../lib/respuesta');
const { Finalizado, HttpCodes } = require('../../../lib/globals');

module.exports = function setupAuthController (services) {
  const { AuthService } = services;

  async function login (req, res, next) {
    debug('Metodo ´para loguearse');
    try {
      const { usuario, contrasena } = req.body;
      const respuesta = await AuthService.login(usuario, contrasena, req);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, respuesta));
    } catch (error) {
      return res.status(error.httpCode || HttpCodes.userError).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  async function codigo (req, res, next) {
    debug('Obtener código state');

    try {
      const result = await AuthService.getCode();
      if (result.code === -1) {
        return next(new Error(result.message));
      }
      if (result.data) {
        res.send(result.data);
      } else {
        return next(new Error('No se pudo generar el state code.'));
      }
    } catch (e) {
      return next(e);
    }
  }

  async function autorizar (req, res, next) {
    debug('Autorizar auth');
    if (req.query.error) {
      return next(new Error(req.query.error));
    } else {
      try {
        const result = await AuthService.authorizate(req, req.ipInfo);

        if (result.code === -1) {
          return next(new Error(result.message));
        }
        if (result.data) {
          res.send(result.data);
        } else {
          return next(new Error('No se pudo realizar la autorización de ingreso al sistema.'));
        }
      } catch (err) {
        return next(err);
      }
    }
  }

  async function logout (req, res, next) {
    debug('Salir del sistema');

    const { codigo, usuario } = req.body;
    try {
      const result = await AuthService.logout(codigo, usuario.usuario);
      if (result.code === 1) {
        res.send(result.data);
      } else {
        res.status(412).send({ error: result.data.message || 'No se pudo cerrar correctamente' });
      }
    } catch (e) {
      return next(e);
    }
  }

  async function refreshToken (req, res) {
    try {
      const { idRol } = req.query;
      const { idUsuario } = req;
      const token = await AuthService.refreshToken(idRol, idUsuario);
      return res.status(200).send(new Respuesta('OK', Finalizado.OK, token));
    } catch (error) {
      return res.status(400).json(new Respuesta(error.message, Finalizado.FAIL));
    }
  }

  return {
    login,
    logout,
    codigo,
    autorizar,
    refreshToken
  };
};
