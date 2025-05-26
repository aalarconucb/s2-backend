'use strict';

const Repository = require('../Repository');
const { toJSON, getQuery } = require('../../lib/util');

module.exports = function redRepository (models, Sequelize) {
  const { red } = models;
  const Op = Sequelize.Op;

  // const attributes = { exclude: ['updatedAt', 'deletedAt', 'idDenuncia', 'userCreated', 'userUpdated', 'userDeleted'] };

  async function listar (params = {}) {
    const query = getQuery(params)
    query.attributes =['id', 'nombre', 'descripcion', 'estado', 'createdAt']
    query.where = {};
    if (params.nombre) {
      query.where.nombre = {
        [Op.iLike]: `%${params.nombre}%`
      };
    }

    if (params.descripcion) {
      query.where.descripcion = {
        [Op.iLike]: `%${params.descripcion}%`
      };
    }
    const result = await red.findAndCountAll(query);
    return toJSON(result);
  }

  return {
    createOrUpdate : (item, t) => Repository.createOrUpdate(item, red, t),
    findById       : id => Repository.findById(id, red),
    listar
  };
};
