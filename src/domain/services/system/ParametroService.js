'use strict';

const debug = require('debug')('app:service:auth');
const { config } = require('../../../common');
const { ErrorApp } = require('../../lib/error');
module.exports = function parametroService (repositories, helpers, res) {
  const { ParametroRepository } = repositories;

  async function findAll (params) {
    try {
      const parametros = await ParametroRepository.findAll(params);
      return parametros;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function findOne (params) {
    try {
      const entidad = await ParametroRepository.findOne(params);
      if (!entidad) {
        throw new Error('La entidad no existe');
      }
      return entidad;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function createOrUpdate (datos) {
    try {
      const parametros = await ParametroRepository.createOrUpdate(datos);
      return parametros;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function eliminar (id) {
    try {
      const parametros = await ParametroRepository.deleteItem(id);
      return parametros;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  return {
    eliminar,
    findOne,
    createOrUpdate,
    findAll
  };
};
