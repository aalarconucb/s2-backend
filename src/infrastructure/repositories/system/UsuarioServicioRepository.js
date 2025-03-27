'use strict';

const { query } = require('express');
const { getQuery, errorHandler, toJSON } = require('../../lib/util');
const Repository = require('../Repository');

module.exports = function usuariosServicioRepository (models, Sequelize) {
  const { usuarioServicio, servicio } = models;

  async function findAll (params = {}) {
    const query = getQuery(params);

    query.where = {};

    if (params.idUsuario) {
      query.where.idUsuario = params.idUsuario;
    }

    query.include = [
      {
        model : servicio,
        as    : 'servicio'
      }
    ];

    const result = await usuarioServicio.findAndCountAll(query);
    return toJSON(result);
  }

  return {
    findAll,
    findOne        : params => Repository.findOne(params, usuarioServicio),
    findById       : id => Repository.findById(id, usuarioServicio),
    createOrUpdate : (item, t) => Repository.createOrUpdate(item, usuarioServicio, t),
    deleteItem     : (id, t) => Repository.deleteItem(id, usuarioServicio, t),
    deleteItemCond : (params, t) => Repository.deleteItemCond(params, usuarioServicio, t)
  };
};
