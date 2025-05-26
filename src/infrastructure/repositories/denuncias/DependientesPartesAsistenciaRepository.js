'use strict';

const Repository = require('../Repository');

module.exports = function victimaRepository (models, Sequelize) {
  const { dependientesPartesAsistencia } = models;

  async function update (data, t) {
    return dependientesPartesAsistencia.update(data,
      {
        include     : { all: true, nested: true },
        transaction : t
      });
  }

  return {
    createOrUpdate: (item, t) => Repository.createOrUpdate(item, dependientesPartesAsistencia, t),
    update
  };
};
