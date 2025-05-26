'use strict';

const Repository = require('../Repository');
const { toJSONArray } = require('../../lib/util');

module.exports = function informePsicologicoRepository (models, Sequelize) {
  const { informePsicologico } = models;
  const attributes = { exclude: ['updatedAt', 'deletedAt', 'idDenuncia', 'userCreated', 'userUpdated', 'userDeleted'], include : ['idDenuncia'] };

  async function listar (idDenuncia) {
    const query = {
      attributes : ['id', 'fecha', 'accionSeguimiento', 'observaciones', 'rutaDocumento', 'createdAt'],
      where      : {
        idDenuncia
      }
    };

    const result = await informePsicologico.findAll(query);
    return toJSONArray(result);
  }

  return {
    createOrUpdate : (item, t) => Repository.createOrUpdate(item, informePsicologico, t),
    findById       : id => Repository.findById(id, informePsicologico, attributes),
    listar
  };
};
