'use strict';

const { getQuery, errorHandler, toJSON } = require('../../lib/util');
const Repository = require('../Repository');

module.exports = function rolPermisoRepository (models, Sequelize) {
  const { rolPermiso } = models;
  async function findAll (params = {}) {
    const query = {};
    query.where = {};

    const result = await rolPermiso.findAndCountAll(query);

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
    const result = await rolPermiso.findOne(query);
    if (result) {
      return result.toJSON();
    }
    return null;
  }
  return {
    findOne,
    findAll,
    createOrUpdate : (item, t) => Repository.createOrUpdate(item, rolPermiso, t),
    deleteItem     : (id, t) => Repository.deleteItem(id, rolPermiso, t),
    deleteItemCond : (params, t) => Repository.deleteItemCond(params, rolPermiso, t)
  };
};
