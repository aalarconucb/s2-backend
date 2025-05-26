'use strict';

const Repository = require('../Repository');

module.exports = function denunciaHistoricoRepository (models, Sequelize) {
  const { denunciaHistorico } = models;
  return {
    createOrUpdate: (item, t) => Repository.createOrUpdate(item, denunciaHistorico, t)
  };
};
