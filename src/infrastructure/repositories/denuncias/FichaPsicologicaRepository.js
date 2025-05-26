'use strict';

const Repository = require('../Repository');
const { toJSONArray } = require('../../lib/util');

module.exports = function fichaPsicologicaRepository (models, Sequelize) {
  const { fichaPsicologica } = models;
  const attributes = {
    exclude: ['updatedAt', 'deletedAt', 'userCreated', 'userUpdated', 'userDeleted', 'idDenuncia'],
    include: ['idDenuncia']
  };

  async function listar (idDenuncia) {
    const query = {
      attributes : ['id', 'fecha', 'accionSeguimiento', 'observaciones', 'rutaDocumento', 'createdAt'],
      where      : {
        idDenuncia
      }
    };

    const result = await fichaPsicologica.findAll(query);
    return toJSONArray(result);
  }

  return {
    createOrUpdate : (item, t) => Repository.createOrUpdate(item, fichaPsicologica, t),
    findById       : id => Repository.findById(id, fichaPsicologica, attributes),
    listar
  };
};
