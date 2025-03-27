'use strict';

const debug = require('debug')('app:service:usuario');
const { ErrorApp } = require('../../lib/error');

module.exports = function usuarioServicioService (repositories, helpers, res) {
  const { UsuarioServicioRepository, UsuarioRepository } = repositories;
  const { FechaHelper } = helpers;

  async function listar (params) {
    try {
      return UsuarioServicioRepository.findAll(params);
    } catch (error) {
      throw new ErrorApp(error.message, 400);
    }
  }

  async function mostrar (id) {
    try {
      return UsuarioServicioRepository.findOne({ id });
    } catch (error) {
      throw new ErrorApp(error.message, 400);
    }
  }

  async function eliminar (id) {
    try {
      return UsuarioServicioRepository.deleteItem(id);
    } catch (error) {
      throw new ErrorApp(error.message, 400);
    }
  }

  return {
    listar,
    mostrar,
    eliminar
  };
};
