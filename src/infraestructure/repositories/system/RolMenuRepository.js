'use strict';

const { getQuery, errorHandler, toJSON } = require('../../lib/util');
const Repository = require('../Repository');

module.exports = function rolMenuRepository (models, Sequelize) {
  const { rolMenu } = models;
  async function findAll (params = {}) {
    const query = {};
    query.where = {};
    if (params.id) {
      query.where.id = params.id;
    }
    if (params.idRol) {
      query.where.idRol = params.idRol;
    }
    const result = await rolMenu.findAndCountAll(query);
    if (result) {
      return result;
    }
    return null;
  }
  async function findOne (params = {}) {
    const query = {};
    query.where = {};
    if (params.id) {
      query.where.id = params.id;
    }
    if (params.idUsuario) {
      query.where.idUsuario = params.idUsuario;
    }

    if (params.idRol) {
      query.where.idRol = params.idRol;
    }
    const result = await rolMenu.findOne(query);
    if (result) {
      return result.toJSON();
    }
    return null;
  }
  return {
    findOne,
    findAll,
    createOrUpdate : (item, t) => Repository.createOrUpdate(item, rolMenu, t),
    deleteItem     : (id, t) => Repository.deleteItem(id, rolMenu, t),
    deleteItemCond : (params, t) => Repository.deleteItemCond(params, rolMenu, t)
  };
};
