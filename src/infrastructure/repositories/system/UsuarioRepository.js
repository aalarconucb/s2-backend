'use strict';

const {
  getQuery,
  errorHandler,
  toJSON,
  toJSONArray
} = require('../../lib/util');
const Repository = require('../Repository');

module.exports = function usuariosRepository (models, Sequelize, sequelize) {
  const Op = Sequelize.Op;
  const {
    usuario,
    rol,
    municipio,
    distrito,
    dpa
  } = models;

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
      'numeroDocumento',
      'fechaNacimiento',
      'primerApellido',
      'segundoApellido',
      'telefono',
      'usuario',
      'tipoContrato',
      'fechaInicioContrato',
      'fechaFinContrato',
      'createdAt',
      'userCreated',
      [
        sequelize.literal(`
          ( SELECT CONCAT(nombres, ' ', primer_apellido, ' ', segundo_apellido)
            FROM sys_usuario c
            WHERE c.id = usuario._user_created
          )
        `), 'usuarioCreador'
      ]
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
        [Op.or]: [{
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

    if (params.codDepartamento) {
      query.where.codDepartamento = params.codDepartamento;
    }

    if (params.idMunicipio) {
      query.where.idMunicipio = params.idMunicipio;
    }

    if (params.idDistrito) {
      query.where.idDistrito = params.idDistrito;
    }

    query.include = [
      {
        through: {
          attributes: []
        },
        model : rol,
        as    : 'roles'
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
      'fechaNacimiento',
      'telefono',
      'cargo',
      'celular',
      'correoElectronico',
      'foto',
      'estado',
      'loginPorCiudadania',
      'idDistrito',
      'tipoContrato',
      'fechaInicioContrato',
      'fechaFinContrato',
      'codDepartamento',
      'idMunicipio',
      'idDistrito',
      'fechaInicioContrato',
      'fechaFinContrato',
      'createdAt',
      'updatedAt',
      'userCreated',
      'idPreregistro',
      'tieneWhatsapp',
      [
        sequelize.literal(`
          ( SELECT CONCAT(nombres, ' ', primer_apellido, ' ', segundo_apellido)
            FROM sys_usuario c
            WHERE c.id = usuario._user_created
          )
        `), 'usuarioCreacion'
      ],
      [
        sequelize.literal(`
          ( SELECT CONCAT(nombres, ' ', primer_apellido, ' ', segundo_apellido)
            FROM sys_usuario c
            WHERE c.id = usuario._user_updated
          )
        `), 'usuarioModificacion'
      ]
    ];

    query.where = params;

    query.include = [
      {
        required : true,
        through  : {
          attributes: []
        },
        attributes: [
          'id',
          'nombre',
          'descripcion',
          'estado'
        ],
        model : rol,
        as    : 'roles'
      },
      {
        model: distrito,
        as    : 'distritoUsuario',
        attributes: [
          'id',
          'nombre',
          'idMunicipio',
        ],
        include: {
          model: municipio,
          as    : 'municipioDistrito',
          attributes: [
            'id',
            'nombre',
            'codigoMunicipio',
          ]
        }
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
        required : true,
        through  : {
          attributes: []
        },
        attributes: [
          'id',
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

  async function buscarPorNumeroDocumento (numeroDocumento) {
    const query = {};

    query.where = {
      numeroDocumento
    };

    const result = await usuario.findOne(query);
    if (result) {
      return result.toJSON();
    }
    return null;
  }

  async function login (params = {}) {
    console.log('login', params);
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
      'estado',
      'idMunicipio',
      'idDistrito',
      'codDepartamento'
    ];

    query.where = params

    query.include = [
      {
        required : true,
        through  : {
          attributes: []
        },
        attributes: [
          'id',
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
      result = await usuario.create(usuarioParam, t
        ? {
            transaction: t
          }
        : {});
    } catch (e) {
      errorHandler(e);
    }
    return result.toJSON();
  }

  async function verificarCorreoElectronico (params) {
    const query = {};
    query.where = {};

    if (params.correoElectronico) {
      Object.assign(query.where, {
        correoElectronico: params.correoElectronico
      });
    }

    if (params.usuario) {
      Object.assign(query.where, {
        usuario: params.usuario
      });
    }

    if (params.usuario && params.correoElectronico) {
      query.where = {
        [Op.or]: [{
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

  async function obtenerProfesionalesPorDistrito (idDistrito) {
    const query = {};
    query.attributes = ['id', 'nombres', 'primerApellido', 'segundoApellido', 'numeroDocumento'];
    query.where = {
      idDistrito
    };

    query.include = [{
      required : true,
      through  : {
        attributes: []
      },
      model      : rol,
      as         : 'roles',
      attributes : ['id', 'nombre']
    }];

    const result = await usuario.findAll(query);
    if (result) {
      return toJSONArray(result);
    }
    return null;
  }

  async function buscarUsuarioPorRolDistrito (distrito, profesional) {
    const query = {};

    query.where = {
      idDistrito: distrito
    };

    query.include = [
      {
        required : true,
        through  : {
          attributes: []
        },
        attributes: [
          'id',
          'nombre',
          'descripcion',
          'estado'
        ],
        model : rol,
        as    : 'roles',
        where : {
          nombre: profesional
        }
      }
    ];

    const result = await usuario.findOne(query);
    if (result) {
      return result.toJSON();
    }
    return null;
  }

  async function obtenerUsuariosMunicipios (params = {}) {
    const select = `
      select su.id, su.nombres, su.primer_apellido, su.segundo_apellido, su.correo_electronico, su.telefono , su.celular, sr.nombre as rol,
      case when m.nombre IS null then m2.nombre else m.nombre end AS municipio,
      case when m.nombre IS null then m2.direccion else m.direccion end AS direccion_municipio,
      case when m.nombre IS null then m2.telefono  else m.telefono end AS telefono_municipio,
      case when sd.departamento IS null then sd2.departamento else sd.departamento end AS departamento,
      d.nombre as nombre_slim, d.direccion as direccion_slim, d.telefono as telefono_slim`;

    const selectCount = 'select count(1) as total';
    let query = `
      from sys_usuario su
      inner join sys_rol_usuario sru on su.id = sru.id_usuario
      inner join sys_rol sr on sru.id_rol = sr.id
      left join municipio m on su."id_municipio" = m.id
      left join sys_dpa sd on m."codigo_municipio" = sd.codigo
      left join distrito d on su."id_distrito" = d.id
      left join municipio m2 ON d."id_municipio" = m2.id
      left join sys_dpa sd2 on m2."codigo_municipio" = sd2.codigo
      where sr.tipo  in ('municipal', 'distrital')`;

    if (params.nombresApellidos) {
      query = `${query} and (su.nombres ilike :nombresApellidos or su.primer_apellido ilike :nombresApellidos or su.segundo_apellido ilike :nombresApellidos)`;
    }

    if (params.codigoDepartamento) {
      query = `${query} and (sd.codigo_departamento = :codigoDepartamento or sd2.codigo_departamento = :codigoDepartamento)`;
    }

    if (params.idRed) {
      query = `${query} and (m.red = :idRed or m2.red = :idRed)`;
    }

    if (params.idMunicipio) {
      query = `${query} and (su."id_municipio" = :idMunicipio or d."id_municipio" = :idMunicipio)`;
    }

    const queryTotal = `${selectCount} ${query}`;
    const options = {
      type         : sequelize.QueryTypes.SELECT,
      replacements : {
        idMunicipio        : params.idMunicipio,
        codigoDepartamento : params.codigoDepartamento,
        idRed              : params.idRed,
        nombresApellidos   : `%${params.nombresApellidos}%`
      }
    };
    const [count] = await sequelize.query(queryTotal, options);

    query = `${select} ${query} order by su.nombres asc offset :offset limit :limit`;
    options.replacements.limit = params.limit;
    options.replacements.offset = params.limit * (params.page - 1);
    const usuarios = await sequelize.query(query, options);

    return {
      count : count.total,
      rows  : usuarios
    };
  }

  return {
    findByCi,
    login,
    findById,
    verificarCorreoElectronico,
    findAll,
    findOne,
    createOrUpdate,
    deleteItem: (id, t) => Repository.deleteItem(id, usuario, t),
    buscarPorNumeroDocumento,
    obtenerProfesionalesPorDistrito,
    buscarUsuarioPorRolDistrito,
    obtenerUsuariosMunicipios
  };
};
