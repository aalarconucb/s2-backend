'use strict';

const { getQuery, toJSON } = require('../../lib/util');
const Repository = require('../Repository');

module.exports = function modulossRepository (models, Sequelize) {
  const { permiso, modulos, rol, aplicacion } = models;
  const Op = Sequelize.Op;

  async function findAll (params = {}) {
    const query = getQuery(params);
    query.where = {};

    query.attributes = [
      'id',
      'nombre',
      'descripcion',
      'tipo',
      'estado',
      [Sequelize.literal('(SELECT FALSE)'), 'permitido']
    ];

    if (params.tipo) {
      query.where.tipo = params.tipo;
    }

    query.include = [
      {
        attributes : [],
        model      : rol,
        as         : 'roles'
      },
      {
        attributes : [],
        model      : aplicacion,
        as         : 'aplicaciones'
      }
    ];

    if (params.idRol) {
      query.include[0].required = true;
      query.include[0].where = {
        id: params.idRol
      };
    }

    if (params.idAplicacion) {
      query.include[1].required = true;
      query.include[1].where = {
        id: params.idAplicacion
      };
    }

    const result = await permiso.findAndCountAll(query);
    return toJSON(result);
  }

  async function findOne (params) {
    const query = {};
    query.where = {};
    query.attributes =  [
      'id',
      'nombre',
      'descripcion',
      'tipo'
    ];
    if (params.idRol) {
      query.where.id = params.idRol;
    }

    query.include = [
      {
        attributes: [
          'id',
          'idModulo',
          'idRol',
          'access',
          'create',
          'read',
          'update',
          'delete',
          'csv'
        ],
        model   : permiso,
        as      : 'permiso',
        include : [
          {
            attributes : [],
            model      : modulos,
            as         : 'modulo',
            where      : { id: params.idModulo }
          }
        ]
      }
    ];
    const result = await rol.findAndCountAll(query);
    return toJSON(result);
  }

  async function findByRoles (roles) {
    const query = {};

    query.where = {
      estado: 'ACTIVO'
    };

    query.attributes = [
      'id',
      'nombre',
      'descripcion',
      'estado',
      'tipo'
    ];

    query.include = [
      {
        required   : true,
        through    : { attributes: [] },
        attributes : [],
        model      : rol,
        as         : 'roles',
        where      : {
          id: {
            [Op.in]: roles
          }
        }
      }
    ];

    const result = await permiso.findAndCountAll(query);
    return toJSON(result);
  }

  async function findByAplicaciones (roles) {
    const query = {};

    query.where = {
      estado: 'ACTIVO'
    };

    query.attributes = [
      'id',
      'nombre',
      'descripcion',
      'estado',
      'tipo'
    ];

    query.include = [
      {
        required   : true,
        through    : { attributes: [] },
        attributes : [],
        model      : aplicacion,
        as         : 'aplicaciones',
        where      : {
          id: {
            [Op.in]: roles
          }
        }
      }
    ];

    const result = await permiso.findAndCountAll(query);
    return toJSON(result);
  }

  async function verificarPermisos (params) {
    const query = {
      attributes: ['id']
    };
    query.where = {
      nombre: {
        [Op.in]: params.permisos
      }

    };

    query.include = [
      {
        required   : true,
        through    : { attributes: [] },
        attributes : [],
        model      : rol,
        as         : 'roles',
        where      : {
          id: {
            [Op.in]: params.roles
          }
        }
      }
    ];

    const result = await permiso.findOne(query);
    if (!result) {
      return null;
    }
    return result.toJSON();
  }

  return {
    findByRoles,
    findByAplicaciones,
    verificarPermisos,
    findAll,
    findOne,
    findById       : (id) => Repository.findById(id, permiso),
    createOrUpdate : (item, t) => Repository.createOrUpdate(item, permiso, t),
    deleteItem     : (id, t) => Repository.deleteItem(id, permiso, t)
  };
};
