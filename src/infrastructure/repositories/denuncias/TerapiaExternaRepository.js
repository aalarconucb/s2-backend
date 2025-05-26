'use strict';

const Repository = require('../Repository');
const { toJSONArray } = require('../../lib/util');

module.exports = function terapiaExternaRepository (models, Sequelize) {
  const { terapiaExterna } = models;
  const attributes = { exclude: ['updatedAt', 'deletedAt', 'idDenuncia', 'userCreated', 'userUpdated', 'userDeleted'], include: ['idDenuncia'] };

  async function listar (idDenuncia) {
    const query = {
      attributes : ['id', 'fecha', 'accionSeguimiento', 'fechaProximaSesion', 'nombreTerapeuta', 'institucion', 'createdAt', 'rutaDocumento'],
      where      : {
        idDenuncia
      }
    };

    const result = await terapiaExterna.findAll(query);
    return toJSONArray(result);
  }

  return {
    createOrUpdate : (item, t) => Repository.createOrUpdate(item, terapiaExterna, t),
    findById       : id => Repository.findById(id, terapiaExterna, attributes),
    listar
  };
};
