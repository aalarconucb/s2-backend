/* eslint-disable max-len */
'use strict';

const Repository = require('../Repository');
const { toJSONArray } = require('../../lib/util');

module.exports = function dependienteRepository (models, Sequelize, sequelize) {
  const { dependiente, persona, parametro } = models;
  const { Op } = Sequelize;

  async function crear (data, t) {
    return dependiente.create(data,
      {
        include     : { all: true, nested: true },
        transaction : t
      });
  }

  async function obtenerDependientes (idsDependientes) {
    if (!idsDependientes || idsDependientes.length === 0) {
      return []
    }

    const query = {
      attributes : ['id', 'idPersona', 'idVictima', 'relacionParentezco'],
      where      : {
        id: {
          [Op.in]: idsDependientes
        }
      },
      include: [
        {
          model: persona,
          as: 'dependientePersona',
          attributes : ['id', 'nombres', 'primerApellido', 'segundoApellido', 'telefono']
        },
        {
          model: parametro,
          as: 'parametroRelacionParentezco',
          attributes : ['id', 'codigo', 'nombre'],
        }
      ]
    }
    const result = await dependiente.findAll(query);
    return toJSONArray(result);
  }

  return {
    createOrUpdate: (item, t) => Repository.createOrUpdate(item, dependiente, t),
    crear,
    obtenerDependientes,
    inactivateItem: (id, t) => Repository.inactivateItem(id, dependiente, t)
  };
};
