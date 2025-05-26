/* eslint-disable max-len */
'use strict';

const Repository = require('../Repository');

module.exports = function denunciadoRepository (models, Sequelize) {
  const { denunciado } = models;

  return {
    createOrUpdate: (item, t) => Repository.createOrUpdate(item, denunciado, t),
  };
};
