/* eslint-disable max-len */
'use strict';

const Repository = require('../Repository');

module.exports = function denuncianteRepository (models, Sequelize) {
  const { denunciante } = models;

  return {
    createOrUpdate: (item, t) => Repository.createOrUpdate(item, denunciante, t),
  };
};
