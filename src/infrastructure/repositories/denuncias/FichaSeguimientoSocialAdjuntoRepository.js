'use strict';

const Repository = require('../Repository');

module.exports = function documentoAsistenciaFamiliarAdjuntoRepository (models, Sequelize) {
  const { fichaSeguimientoSocialAdjunto } = models;
  const attributes = { exclude: ['updatedAt', 'deletedAt', 'idDenuncia', 'userCreated', 'userUpdated', 'userDeleted'] };

  return {
    createOrUpdate : (item, t) => Repository.createOrUpdate(item, fichaSeguimientoSocialAdjunto, t),
    findById       : id => Repository.findById(id, fichaSeguimientoSocialAdjunto, attributes)
  };
};
