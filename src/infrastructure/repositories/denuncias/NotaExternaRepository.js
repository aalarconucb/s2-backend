'use strict';

const Repository = require('../Repository');
const { toJSONArray } = require('../../lib/util');

module.exports = function notaExternaRepository (models, Sequelize) {
  const { notaExterna } = models;
  const attributes = { exclude: ['updatedAt', 'deletedAt', 'idDenuncia', 'userCreated', 'userUpdated', 'userDeleted'] };

  async function listar (idDenuncia) {
    const query = {
      attributes : ['id', 'fecha', 'descripcion', 'createdAt', 'rutaDocumento'],
      where      : {
        idDenuncia
      }
    };

    const result = await notaExterna.findAll(query);
    return toJSONArray(result);
  }

  return {
    createOrUpdate : (item, t) => Repository.createOrUpdate(item, notaExterna, t),
    findById       : id => Repository.findById(id, notaExterna, attributes),
    listar
  };
};
