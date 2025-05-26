'use strict';

const Repository = require('../Repository');
const { toJSONArray } = require('../../lib/util');

module.exports = function informeSocialRepository (models, Sequelize) {
  const { informeSocial } = models;
  const attributes = { exclude: ['updatedAt', 'deletedAt', 'idDenuncia', 'userCreated', 'userUpdated', 'userDeleted'], include: ['idDenuncia'] };

  async function listar (idDenuncia) {
    const query = {
      attributes : ['id', 'fecha', 'accionSeguimiento', 'observaciones', 'rutaDocumento', 'createdAt'],
      where      : {
        idDenuncia
      }
    };

    const result = await informeSocial.findAll(query);
    return toJSONArray(result);
  }

  return {
    createOrUpdate : (item, t) => Repository.createOrUpdate(item, informeSocial, t),
    findById       : id => Repository.findById(id, informeSocial, attributes),
    listar
  };
};
