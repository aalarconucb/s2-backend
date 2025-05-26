'use strict';

const Repository = require('../Repository');
const { toJSONArray } = require('../../lib/util');

module.exports = function terapiaSlimRepository (models, Sequelize) {
  const { terapiaSlim } = models;
  const attributes = { exclude: ['updatedAt', 'deletedAt', 'idDenuncia', 'userCreated', 'userUpdated', 'userDeleted'], include: ['idDenuncia'] };

  async function listar (idDenuncia) {
    const query = {
      attributes : ['id', 'fecha', 'accionSeguimiento', 'fechaProximaSesion', 'abordajeTerapeutico', 'prescripcionesTerapeuticas', 'numeroSesion', 'horaProximaSesion', 'createdAt'],
      where      : {
        idDenuncia
      }
    };

    const result = await terapiaSlim.findAll(query);
    return toJSONArray(result);
  }

  return {
    createOrUpdate : (item, t) => Repository.createOrUpdate(item, terapiaSlim, t),
    findById       : id => Repository.findById(id, terapiaSlim, attributes),
    listar
  };
};
