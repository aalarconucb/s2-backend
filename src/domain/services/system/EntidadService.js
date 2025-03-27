'use strict';

const debug = require('debug')('app:service:auth');
const { config } = require('../../../common');
const { ErrorApp } = require('../../lib/error');

module.exports = function entidadService (repositories, helpers, res) {
  const { EntidadRepository } = repositories;

  async function listar (params) {
    try {
      const comentarios = await EntidadRepository.findAll(params);
      return comentarios;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function findOne (params) {
    try {
      const entidad = await EntidadRepository.findOne(params);
      if (!entidad) {
        throw new Error('La entidad no existe');
      }
      return entidad;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function createOrUpdate (data) {
    debug('Crear o actualizar Entidad');
    let entidad;
    try {
      entidad = await EntidadRepository.createOrUpdate(data);
      return entidad;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function deleteItem (id) {
    debug('Eliminando entidad', id);
    try {
      const resultado = await EntidadRepository.deleteItem(id);
      return resultado;
    } catch (err) {
      debug(err);
      throw new ErrorApp(err.message, 400);
    }
  }

  return {
    findOne,
    listar,
    createOrUpdate,
    deleteItem
  };
};
