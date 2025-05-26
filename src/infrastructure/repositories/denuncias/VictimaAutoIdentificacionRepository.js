'use strict';

const Repository = require('../Repository');

module.exports = function victimaAutoIdentificacionRepository (models, Sequelize) {
  const { victimaAutoIdentificacion } = models;
  return {
    createOrUpdate: (item, t) => Repository.createOrUpdate(item, victimaAutoIdentificacion, t)
  };
};
