'use strict';

const { query } = require('express');
const { getQuery, errorHandler, toJSON } = require('../../lib/util');
const Repository = require('../Repository');

module.exports = function usuariosRepository (models, Sequelize) {
  const Op = Sequelize.Op;
  const { usuario, rol, entidad, menu } = models;

  async function findAll (params = {}) {
    const query = getQuery(params);
    query.attributes = [
      'celular',
      'correoElectronico',
      'estado',
      'foto',
      'id',
      'nombres',
      'cargo',
      'idEntidad',
      'numeroDocumento',
      'primerApellido',
      'segundoApellido',
      'telefono',
      'usuario',
      'createdAt'
    ];
    query.where = {};

    if (params.exclude) {
      query.where.id = {
        [Op.notIn]: Array.isArray(params.exclude) ? params.exclude : [params.exclude]
      };
    }

    if (params.estado) {
      query.where.estado = params.estado;
    }

    if (params.search) {
      query.where = {
        ...query.where,
        [Op.or]: [
          {
            nombres: {
              [Op.iLike]: `%${params.search}%`
            }
          },
          {
            primerApellido: {
              [Op.iLike]: `%${params.search}%`
            }
          },
          {
            segundoApellido: {
              [Op.iLike]: `%${params.search}%`
            }
          }
        ]
      };
    }

    if (params.usuario) {
      query.where.usuario = {
        [Op.iLike]: `%${params.usuario}%`
      };
    }

    if (params.nombres) {
      query.where.nombres = {
        [Op.iLike]: `%${params.nombres}%`
      };
    }

    if (params.primerApellido) {
      query.where.primerApellido = {
        [Op.iLike]: `%${params.primerApellido}%`
      };
    }

    if (params.segundoApellido) {
      query.where.segundoApellido = {
        [Op.iLike]: `%${params.segundoApellido}%`
      };
    }

    if (params.numeroDocumento) {
      query.where.numeroDocumento = {
        [Op.iLike]: `%${params.numeroDocumento}%`
      };
    }

    if (params.correoElectronico) {
      query.where.correoElectronico = {
        [Op.iLike]: `%${params.correoElectronico}%`
      };
    }

    if (params.celular) {
      query.where.celular = {
        [Op.iLike]: `%${params.celular}%`
      };
    }

    query.include = [
      {
        attributes : ['id', 'nombre', 'sigla', 'nivel', 'idEntidad'],
        model      : entidad,
        as         : 'entidad'
      },
      {
        through : { attributes: [] },
        model   : rol,
        as      : 'roles'
      }
    ];

    const result = await usuario.findAndCountAll(query);
    return toJSON(result);
  }

  async function findOne (params = {}) {
    const query = {};
    query.attributes = [
      'id',
      'usuario',
      'nombres',
      'primerApellido',
      'segundoApellido',
      'numeroDocumento',
      'telefono',
      'idEntidad',
      'cargo',
      'celular',
      'correoElectronico',
      'foto',
      'estado'
    ];

    query.where = params;

    query.include = [
      {
        attributes : ['id', 'nombre', 'sigla', 'nivel', 'idEntidad'],
        model      : entidad,
        as         : 'entidad'
      },
      {
        required   : true,
        through    : { attributes: [] },
        attributes : [
          'id',
          'idEntidad',
          'nombre',
          'descripcion',
          'estado'
        ],
        model : rol,
        as    : 'roles'
      }
    ];

    const result = await usuario.findOne(query);
    if (result) {
      return result.toJSON();
    }
    return null;
  }

  async function findByCi (params = {}) {
    const query = {};

    query.where = params;

    query.include = [
      {
        attributes : ['id', 'nombre', 'sigla', 'nivel', 'idEntidad'],
        model      : entidad,
        as         : 'entidad'
      },
      {
        required   : true,
        through    : { attributes: [] },
        attributes : [
          'id',
          'idEntidad',
          'nombre',
          'descripcion',
          'estado'
        ],
        model : rol,
        as    : 'roles'
      }
    ];

    const result = await usuario.findOne(query);
    if (result) {
      return result.toJSON();
    }
    return null;
  }

  async function login (params = {}) {
    const query = {};
    query.attributes = [
      'id',
      'contrasena',
      'usuario',
      'nombres',
      'primerApellido',
      'segundoApellido',
      'numeroDocumento',
      'telefono',
      'celular',
      'correoElectronico',
      'foto',
      'estado'
    ];

    query.where = params;

    query.include = [
      {
        attributes : ['id', 'nombre', 'sigla', 'nivel', 'idEntidad'],
        model      : entidad,
        as         : 'entidad'
      },
      {
        required   : true,
        through    : { attributes: [] },
        attributes : [
          'id',
          'idEntidad',
          'nombre',
          'descripcion',
          'estado'
        ],
        model : rol,
        as    : 'roles'
      }
    ];

    const result = await usuario.findOne(query);
    if (result) {
      return result.toJSON();
    }
    return null;
  }

  async function findById (id) {
    const query = {};

    query.where = {
      id,
      estado: 'ACTIVO'
    };

    const result = await usuario.findOne(query);
    if (result) {
      return result.toJSON();
    }
    return null;
  }

  async function createOrUpdate (usuarioParam, t) {
    const cond = {
      where: {
        id: usuarioParam.id || null
      }
    };

    const item = await usuario.findOne(cond);

    if (item) {
      let updated;
      try {
        if (t) {
          cond.transaction = t;
        }
        updated = await usuario.update(usuarioParam, cond);
      } catch (e) {
        errorHandler(e);
      }
      const result = updated ? await usuario.findOne(cond) : item;

      if (result) {
        return result.toJSON();
      }
      return null;
    }

    let result;
    try {
      result = await usuario.create(usuarioParam, t ? { transaction: t } : {});
    } catch (e) {
      errorHandler(e);
    }
    return result.toJSON();
  }

  async function verificarCorreoElectronico (params) {
    const query = {};
    query.where = {};

    if (params.correoElectronico) {
      Object.assign(query.where, { correoElectronico: params.correoElectronico });
    }

    if (params.usuario) {
      Object.assign(query.where, { usuario: params.usuario });
    }

    if (params.usuario && params.correoElectronico) {
      query.where = {
        [Op.or]: [
          {
            usuario: params.usuario
          },
          {
            correoElectronico: params.correoElectronico
          }
        ]
      };
    }

    if (params.id) {
      query.where.id = {
        [Op.not]: params.id
      };
    }

    const result = await usuario.findOne(query);
    if (result) {
      return result.toJSON();
    }
    return null;
  }

  return {
    findByCi,
    login,
    findById,
    verificarCorreoElectronico,
    findAll,
    findOne,
    createOrUpdate,
    deleteItem: (id, t) => Repository.deleteItem(id, usuario, t)
  };
};
