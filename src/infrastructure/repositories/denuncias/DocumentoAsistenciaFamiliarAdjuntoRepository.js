'use strict';

const Repository = require('../Repository');

module.exports = function documentoAsistenciaFamiliarAdjuntoRepository (models, Sequelize) {
  const { documentoAsistenciaFamiliarAdjunto } = models;
  const attributes = { exclude: ['updatedAt', 'deletedAt', 'idDenuncia', 'userCreated', 'userUpdated', 'userDeleted'] };

  return {
    createOrUpdate : (item, t) => Repository.createOrUpdate(item, documentoAsistenciaFamiliarAdjunto, t),
    findById       : id => Repository.findById(id, documentoAsistenciaFamiliarAdjunto, attributes)
  };
};
