'use strict';

const Repository = require('../Repository');
const { toJSONArray } = require('../../lib/util');

module.exports = function victimaPoblacionVulnerableRepository (models, Sequelize) {
  const { victimaPoblacionVulnerable } = models;

  async function getByIdVictima (idVictima) {
    const query = {
      where: {
        idVictima: idVictima,
        estado: 'ACTIVO'
      },
      attributes: ['id', 'idVictima', 'id', 'idPoblacionVulnerable', 'estado']
    }
    const result = await victimaPoblacionVulnerable.findAll(query);
    return toJSONArray(result)
  }

  return {
    createOrUpdate: (item, t) => Repository.createOrUpdate(item, victimaPoblacionVulnerable, t),
    getByIdVictima,
    deleteItem     : (id, t) => Repository.deleteItem(id, victimaPoblacionVulnerable, t)
  };
};
