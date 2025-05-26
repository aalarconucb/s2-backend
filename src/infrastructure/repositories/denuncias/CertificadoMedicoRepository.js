'use strict';

const Repository = require('../Repository');
const { toJSONArray } = require('../../lib/util');

module.exports = function certificadoMedicoRepository (models, Sequelize) {
  const { certificadoMedico } = models;
  const attributes = { exclude: ['updatedAt', 'deletedAt', 'idDenuncia', 'userCreated', 'userUpdated', 'userDeleted'] };

  async function listar (idDenuncia) {
    const query = {
      attributes : ['id', 'fecha', 'descripcion', 'createdAt', 'rutaDocumento'],
      where      : {
        idDenuncia
      }
    };

    const result = await certificadoMedico.findAll(query);
    return toJSONArray(result);
  }

  return {
    createOrUpdate : (item, t) => Repository.createOrUpdate(item, certificadoMedico, t),
    findById       : id => Repository.findById(id, certificadoMedico, attributes),
    listar
  };
};
