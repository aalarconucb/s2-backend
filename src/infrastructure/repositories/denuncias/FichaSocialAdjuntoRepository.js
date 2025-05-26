'use strict';

const Repository = require('../Repository');

module.exports = function documentoAsistenciaFamiliarAdjuntoRepository (models, Sequelize) {
  const { fichaSocialAdjunto } = models;
  const attributes = { exclude: ['updatedAt', 'deletedAt', 'idDenuncia', 'userCreated', 'userUpdated', 'userDeleted'] };

  return {
    createOrUpdate : (item, t) => Repository.createOrUpdate(item, fichaSocialAdjunto, t),
    findById       : id => Repository.findById(id, fichaSocialAdjunto, attributes)
  };
};
