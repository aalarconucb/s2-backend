'use strict';

const Repository = require('../Repository');

module.exports = function victimaRepository (models, Sequelize) {
  const { victima, victimaPoblacionVulnerable } = models;

  async function update (data, t) {
    return victima.update(data,
      {
        include     : { all: true, nested: true },
        transaction : t
      });
  }

  async function getVulnerabilidades (idVictima) {
    const query = {
      where: {
        idVictima: idVictima,
        estado: 'ACTIVO'
      },
      attributes: ['id', 'idVictima', 'id', 'idPoblacionVulnerable', 'estado']
    }
    const result = await victimaPoblacionVulnerable.findAll(query);
    return result.map(item => item.idPoblacionVulnerable)
  }

  return {
    createOrUpdate: (item, t) => Repository.createOrUpdate(item, victima, t),
    update,
    getVulnerabilidades
  };
};
