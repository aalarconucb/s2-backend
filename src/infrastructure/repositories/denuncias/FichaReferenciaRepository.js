'use strict';

const Repository = require('../Repository');
const { toJSONArray } = require('../../lib/util');

module.exports = function fichaReferenciaRepository (models, Sequelize) {
  const { fichaReferencia } = models;
  const attributes = { exclude: ['updatedAt', 'deletedAt', 'userCreated', 'userUpdated', 'userDeleted'] };

  async function listar (idDenuncia) {
    const query = {
      attributes : ['id', 'fecha', 'institucion', 'servicio', 'createdAt', 'rutaDocumento'],
      where      : {
        idDenuncia
      }
    };

    const result = await fichaReferencia.findAll(query);
    return toJSONArray(result);
  }

  return {
    createOrUpdate : (item, t) => Repository.createOrUpdate(item, fichaReferencia, t),
    findById       : id => Repository.findById(id, fichaReferencia, attributes),
    listar
  };
};
