'use strict';

const Repository = require('../Repository');

module.exports = function personaRepository (models, Sequelize) {
  const { persona } = models;

  return {
    createOrUpdate: (item, t) => Repository.createOrUpdate(item, persona, t)
  };
};
