'use strict';

const Repository = require('../Repository');

module.exports = function personaRepository (models, Sequelize) {
  const { domicilio } = models;

  return {
    createOrUpdate: (item, t) => Repository.createOrUpdate(item, domicilio, t)
  };
};
