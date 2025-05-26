'use strict';

const Repository = require('../Repository');
const { toJSONArray } = require('../../lib/util');

module.exports = function citacionRepository (models, Sequelize) {
  const { citacion } = models;
  const attributes = { exclude: ['updatedAt', 'deletedAt', 'idDenuncia', 'userCreated', 'userUpdated', 'userDeleted'], include: ['idDenuncia'] };

  async function listar (idDenuncia) {
    const query = {
      attributes : ['id', 'fecha', 'a', 'sobre', 'denunciaInterpuestaPor', 'paraDia', 'paraHoras', 'accionSeguimiento',  'createdAt'],
      where      : {
        idDenuncia
      }
    };

    const result = await citacion.findAll(query);
    return toJSONArray(result);
  }

  return {
    createOrUpdate : (item, t) => Repository.createOrUpdate(item, citacion, t),
    findById       : id => Repository.findById(id, citacion, attributes),
    listar
  };
};
