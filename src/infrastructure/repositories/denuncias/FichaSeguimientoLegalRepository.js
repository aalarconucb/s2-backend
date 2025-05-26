'use strict';

const Repository = require('../Repository');
const { toJSONArray } = require('../../lib/util');

module.exports = function fichaSeguimientoLegalRepository (models, Sequelize) {
  const { fichaSeguimientoLegal } = models;
  const attributes = { exclude: ['updatedAt', 'deletedAt', 'idDenuncia', 'userCreated', 'userUpdated', 'userDeleted'], include: ['idDenuncia'] };

  async function listar (idDenuncia) {
    const query = {
      attributes : ['id', 'fecha', 'accionSeguimiento', 'observaciones', 'rutaDocumento', 'createdAt'],
      where      : {
        idDenuncia
      }
    };

    const result = await fichaSeguimientoLegal.findAll(query);
    return toJSONArray(result);
  }

  return {
    createOrUpdate : (item, t) => Repository.createOrUpdate(item, fichaSeguimientoLegal, t),
    findById       : id => Repository.findById(id, fichaSeguimientoLegal, attributes),
    listar
  };
};
