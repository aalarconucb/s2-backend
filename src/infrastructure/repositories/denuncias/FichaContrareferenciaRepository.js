'use strict';

const Repository = require('../Repository');
const { toJSONArray } = require('../../lib/util');

module.exports = function fichaContrareferenciaRepository (models, Sequelize) {
  const { fichaContrareferencia } = models;
  const attributes = { exclude: ['updatedAt', 'deletedAt', 'idDenuncia', 'userCreated', 'userUpdated', 'userDeleted'] };

  async function listar (idDenuncia) {
    const query = {
      attributes : ['id', 'fecha', 'institucion', 'createdAt', 'rutaDocumento', 'tipoAtencion'],
      where      : {
        idDenuncia
      }
    };

    const result = await fichaContrareferencia.findAll(query);
    return toJSONArray(result);
  }

  return {
    createOrUpdate : (item, t) => Repository.createOrUpdate(item, fichaContrareferencia, t),
    findById       : id => Repository.findById(id, fichaContrareferencia, attributes),
    listar
  };
};
