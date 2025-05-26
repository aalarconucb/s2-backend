'use strict';

const Repository = require('../Repository');

module.exports = function victimaRepository (models, Sequelize) {
  const { partesAsistenciaFamiliar } = models;

  async function update (data, t) {
    return partesAsistenciaFamiliar.update(data,
      {
        include     : { all: true, nested: true },
        transaction : t
      });
  }

  return {
    createOrUpdate: (item, t) => Repository.createOrUpdate(item, partesAsistenciaFamiliar, t),
    update
  };
};
