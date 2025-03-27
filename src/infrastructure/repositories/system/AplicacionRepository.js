'use strict';

const { getQuery, toJSON } = require('../../lib/util');
const Repository = require('../Repository');

module.exports = function rolesRepository (models, Sequelize) {
  const { aplicacion, menu, entidad } = models;
  const Op = Sequelize.Op;

  const attributes = ['id', 'idEntidad', 'nombre', 'descripcion', 'estado', 'createdAt'];

  async function findAll (params = {}) {
    const query = getQuery(params);
    query.where = {};

    query.include = [
      {
        attributes: [
          'id',
          'sigla',
          'nombre',
          'idEntidad',
          'nivel'
        ],
        model : entidad,
        as    : 'entidad'
      }
    ];

    if (params.idEntidad) {
      query.where.idEntidad = params.idEntidad;
    }

    if (params.entidades && !params.idEntidad) {
      query.where.idEntidad = {
        [Op.in]: params.entidades
      };
    }

    if (params.estado) {
      query.where.estado = params.estado;
    }

    if (params.nombre) {
      query.where.nombre = {
        [Op.iLike]: `%${params.nombre}%`
      };
    }

    if (params.descripcion) {
      query.where.nombre = {
        [Op.iLike]: `%${params.descripcion}%`
      };
    }

    const result = await aplicacion.findAndCountAll(query);
    return toJSON(result);
  }

  async function findOne (params = {}) {
    const query = {
      where: params
    };

    query.include = [
      {
        attributes: [
          'id',
          'sigla',
          'nombre',
          'idEntidad',
          'nivel'
        ],
        model : entidad,
        as    : 'entidad'
      }
    ];
    const result = await aplicacion.findOne(query);
    if (!result) {
      return null;
    }
    return result.toJSON();
  }

  return {
    findAll,
    findOne,
    findById       : id => Repository.findById(id, aplicacion, attributes),
    createOrUpdate : (item, t) => Repository.createOrUpdate(item, aplicacion, t),
    deleteItem     : (id, t) => Repository.deleteItem(id, aplicacion, t)
  };
};
