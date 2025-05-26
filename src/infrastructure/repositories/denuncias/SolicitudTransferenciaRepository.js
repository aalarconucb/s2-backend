'use strict';

const Repository = require('../Repository');

module.exports = function solicitudTransferenciaRepository (models, Sequelize) {
  const { solicitudTransferencia } = models;
  const attributes = { exclude: ['updatedAt', 'deletedAt', 'idDenuncia', 'userCreated', 'userUpdated', 'userDeleted'] };

  return {
    createOrUpdate : (item, t) => Repository.createOrUpdate(item, solicitudTransferencia, t),
    findById       : id => Repository.findById(id, solicitudTransferencia, attributes)
  };
};
