/* eslint-disable max-len */
'use strict';

const { getQuery, toJSON, toJSONArray } = require('../../lib/util');
const Repository = require('../Repository');
const { formatearFecha } = require('../../lib/date');

module.exports = function denunciaRepository (models, Sequelize, sequelize) {
  const { denuncia, municipio, distrito, dpa, parametro, victima, persona, dependiente, denunciante, denunciado, usuario, rol, domicilio } = models;
  const { Op, QueryTypes, literal } = Sequelize;

  // async function crear (data, t) {
  //   return denuncia.create(data,
  //     {
  //       include     : { all: true, nested: true },
  //       transaction : t
  //     });
  // }

  async function buscarPorId (idDenuncia) {
    const query = {
      where: {
        id: idDenuncia
      },
      // include: { all: true }
      include: [
        {
          model   : distrito,
          as      : 'distritoDenuncia',
          include : {
            model   : municipio,
            as      : 'municipioDistrito',
            include : {
              model : dpa,
              as    : 'dpaMunicipio'
            }
          }
        },
        {
          model : parametro,
          as    : 'parametroTipologiaPrincipal'
        },
        {
          model : parametro,
          as    : 'parametroTipologiaSecundaria'
        },
        {
          model   : victima,
          as      : 'victimaDenuncia',
          include : [{
            model   : persona,
            as      : 'victimaPersona',
            // include : {
            //   all: true
            // }
          }, {
            model   : dependiente,
            as      : 'dependienteVictima', /*  include : {
              model : parametro,
              as    : 'parametroRelacionParentezco'
            } */
            include : [
              {
                model : persona,
                as    : 'dependientePersona'
              }
            ]
          }]
        },
        {
          model   : denunciante,
          as      : 'denuncianteDenuncia',
          include : [
            {
              model : persona,
              as    : 'denunciantePersona'
            }
          ]
        },
        {
          model : denunciado,
          as    : 'denunciadoDenuncia'
        }
      ]
    };
    const result = await denuncia.findOne(query);

    if (!result) return null;

    return result.toJSON();
  }

  async function obtenerDetalleDenuncia (idDenuncia) {
    const query = {
      attributes : [
        'id',
        'codigoRuv',
        'relacionHecho',
        'direccionHecho',
        'rutaDocumento',
        'codigoMunicipio',
        'fechaHecho',
        'createdAt',
        'updatedAt',
        [
          sequelize.literal(`
            ( SELECT CONCAT(nombres, ' ', primer_apellido, ' ', segundo_apellido)
              FROM sys_usuario u
              WHERE u.id = denuncia._user_created
            )
          `), 'usuarioCreacion'
        ],
        [
          sequelize.literal(`
            ( SELECT CONCAT(nombres, ' ', primer_apellido, ' ', segundo_apellido)
              FROM sys_usuario u
              WHERE u.id = denuncia._user_updated
            )
          `), 'usuarioModificacion'
        ]
      ],
      where      : {
        id: idDenuncia
      },
      include: [
        {
          model      : distrito,
          as         : 'distritoDenuncia',
          attributes : ['id', 'nombre'],
          include    : {
            model      : municipio,
            as         : 'municipioDistrito',
            attributes : ['id', 'nombre'],
            include    : {
              model      : dpa,
              as         : 'dpaMunicipio',
              attributes : ['codigo', 'municipio', 'departamento']
            }
          }
        },
        {
          model      : parametro,
          as         : 'parametroTipologiaPrincipal',
          attributes : ['id', 'nombre', 'orden', 'codigo']
        },
        {
          model      : parametro,
          as         : 'parametroTipologiaSecundaria',
          attributes : ['id', 'nombre', 'orden', 'codigo']
        }
      ]
    };
    const result = await denuncia.findOne(query);

    if (!result) return null;

    return result.toJSON();
  }

  async function obtenerDetalleVictima (idDenuncia) {
    const query = {
      // attributes : ['id', 'ocupacion', 'institucionLaboral', 'direccionLaboral', 'telefonoLaboral', 'direccionDomicilio'],
      include: [
        {
          model : denuncia,
          as    : 'denunciaVictima',
          where : {
            id: idDenuncia
          },
          attributes: ['id']
        },
        {
          model      : parametro,
          as         : 'poblacionVulnerable',
          attributes : ['id', 'nombre', 'codigo'],

        },
        {
          model      : parametro,
          as         : 'victimaAutoidentificacion',
          attributes : ['id', 'nombre', 'codigo']
        },
        {
          model      : persona,
          as         : 'victimaPersona',
          attributes : ['id', 'numeroDocumento', 'fechaNacimiento', 'nombres', 'primerApellido', 'segundoApellido', 'telefono', 'nombreConvencional'],
          include    : [
            {
              model      : parametro,
              as         : 'parametroTipoDocumento',
              attributes : ['id', 'nombre', 'codigo']
            },
            {
              model      : parametro,
              as         : 'parametroGenero',
              attributes : ['id', 'nombre', 'codigo']
            },
            {
              model      : parametro,
              as         : 'parametroEstadoCivil',
              attributes : ['id', 'nombre', 'codigo']
            },
            {
              model      : domicilio,
              as         : 'domicilioPersona',
              attributes : ['id', 'tipoDomicilio', 'direccion', 'telefono', 'latitud', 'longitud', 'institucionLaboral', 'codigoMunicipio']
            }
          ]
        },
        {
          model      : dependiente,
          as         : 'dependienteVictima',
          attributes : ['id', 'estudia', 'relacionParentescoOtro'],
          include    : [
            {
              model      : parametro,
              as         : 'parametroRelacionParentezco',
              attributes : ['id', 'nombre', 'codigo']
            },
            {
              model      : persona,
              as         : 'dependientePersona',
              attributes : ['id', 'numeroDocumento', 'nombres', 'primerApellido', 'segundoApellido', 'fechaNacimiento', 'telefono'],
              include    : [
                {
                  model : parametro,
                  as    : 'parametroTipoDocumento',
                  attributes : ['id', 'nombre', 'codigo']
                  // attributes : ['id', 'nombre']
                },
                {
                  model      : parametro,
                  as         : 'parametroGenero',
                  attributes : ['id', 'nombre', 'codigo']
                },
                {
                  model      : parametro,
                  as         : 'parametroEstadoCivil',
                  attributes : ['id', 'nombre', 'codigo']
                }
              ]
            }
          ]
        }
      ]
    };
    const result = await victima.findOne(query);

    if (!result) return null;

    return result.toJSON();
  }

  async function obtenerDetalleDenunciados (idDenuncia) {
    const query = {
      // attributes : ['id', 'ocupacion', 'institucionLaboral', 'direccionLaboral', 'telefonoLaboral', 'direccionDomicilio'],
      include: [
        {
          model : denuncia,
          as    : 'denunciaDenunciado',
          where : {
            id: idDenuncia
          },
          attributes: ['id']
        },
        {
          model      : parametro,
          as         : 'parametroTipoDenunciado',
          attributes : ['id', 'nombre', 'codigo']
        },
        {
          model      : parametro,
          as         : 'parametroRelacionParentezco',
          attributes : ['id', 'nombre', 'codigo']
        },
        {
          model      : persona,
          as         : 'denunciadoPersona',
          attributes : ['id', 'numeroDocumento', 'fechaNacimiento', 'nombres', 'primerApellido', 'segundoApellido', 'telefono'],
          include    : [
            {
              model      : parametro,
              as         : 'parametroTipoDocumento',
              attributes : ['id', 'nombre', 'codigo']
            },
            {
              model      : parametro,
              as         : 'parametroGenero',
              attributes : ['id', 'nombre', 'codigo']
            },
            {
              model      : parametro,
              as         : 'parametroEstadoCivil',
              attributes : ['id', 'nombre', 'codigo']
            },
            {
              model      : domicilio,
              as         : 'domicilioPersona',
              attributes : ['id', 'tipoDomicilio', 'direccion', 'telefono', 'latitud', 'longitud', 'institucionLaboral', 'codigoMunicipio']
            }
          ]
        }
      ]
    };
    const result = await denunciado.findAll(query);
    if (!result) return null;
    return toJSONArray(result);
  }

  async function obtenerDetalleDenunciante (idDenuncia) {
    const query = {
      // attributes : ['id', 'ocupacion', 'institucionLaboral', 'direccionLaboral', 'telefonoLaboral', 'direccionDomicilio'],
      include: [
        {
          model : denuncia,
          as    : 'denunciaDenunciante',
          where : {
            id: idDenuncia
          },
          attributes: ['id']
        },
        {
          model      : parametro,
          as         : 'parametroTipoDenunciante',
          attributes : ['id', 'nombre', 'codigo']
        },
        {
          model      : parametro,
          as         : 'parametroRelacionParentezco',
          attributes : ['id', 'nombre']
        },
        {
          model      : persona,
          as         : 'denunciantePersona',
          attributes : ['id', 'numeroDocumento', 'fechaNacimiento', 'nombres', 'primerApellido', 'segundoApellido', 'telefono'],
          include    : [
            {
              model      : parametro,
              as         : 'parametroTipoDocumento',
              attributes : ['id', 'nombre']
            },
            {
              model      : parametro,
              as         : 'parametroGenero',
              attributes : ['id', 'nombre']
            },
            {
              model      : parametro,
              as         : 'parametroEstadoCivil',
              attributes : ['id', 'nombre']
            }
          ]
        }
      ]
    };
    const result = await denunciante.findOne(query);

    if (!result) return null;

    return result.toJSON();
  }

  async function buscarPorNumeroDocumento (numeroDocumento) {
    const query = {
      attributes : ['id', 'codigoRuv', 'relacionHecho', 'createdAt'],
      include    : [
        {
          model      : victima,
          as         : 'victimaDenuncia',
          attributes : ['id'],
          required   : true,
          include    : [
            {
              model      : persona,
              as         : 'victimaPersona',
              attributes : ['numeroDocumento', 'fechaNacimiento', 'nombres', 'primerApellido', 'segundoApellido'],
              where      : {
                numeroDocumento
              }
            }
          ]
        },
        {
          model      : distrito,
          as         : 'distritoDenuncia',
          attributes : ['id', 'nombre'],
          include    : [
            {
              model      : municipio,
              as         : 'municipioDistrito',
              attributes : ['nombre', 'codigoMunicipio'],
              include    : {
                model      : dpa,
                as         : 'dpaMunicipio',
                attributes : ['departamento', 'provincia', 'municipio']
              }
            }
          ]
        },
        {
          model      : parametro,
          as         : 'parametroTipologiaPrincipal',
          attributes : ['nombre']
        }
      ]
    };
    const result = await denuncia.findAll(query);

    if (!result) return null;

    return result;
  }

  async function buscarPorNombreApellido (nombres, primerApellido, segundoApellido) {
    const query = {
      attributes : ['id', 'codigoRuv', 'relacionHecho', 'createdAt'],
      include    : [
        {
          model      : victima,
          as         : 'victimaDenuncia',
          attributes : ['id'],
          required   : true,
          include    : [
            {
              model      : persona,
              as         : 'victimaPersona',
              attributes : ['numeroDocumento', 'fechaNacimiento', 'nombres', 'primerApellido', 'segundoApellido'],
              where      : {
                [Op.and]: [
                  {
                    nombres: {
                      [Op.iLike]: `%${nombres}%`
                    }
                  },
                  {
                    primerApellido: {
                      [Op.iLike]: `%${primerApellido}%`
                    }
                  },
                  {
                    segundoApellido: {
                      [Op.iLike]: `%${segundoApellido}%`
                    }
                  }
                ]
              }
            }
          ]
        },
        {
          model      : distrito,
          as         : 'distritoDenuncia',
          attributes : ['id', 'nombre'],
          include    : [
            {
              model      : municipio,
              as         : 'municipioDistrito',
              attributes : ['nombre', 'codigoMunicipio'],
              include    : {
                model      : dpa,
                as         : 'dpaMunicipio',
                attributes : ['departamento', 'provincia', 'municipio']
              }
            }
          ]
        },
        {
          model      : parametro,
          as         : 'parametroTipologiaPrincipal',
          attributes : ['nombre']
        }
      ]
    };

    if (!nombres) {
      query.include[0].include[0].where[Op.and][0].nombres = null;
    }
    if (!primerApellido) {
      query.include[0].include[0].where[Op.and][1].primerApellido = null;
    }
    if (!segundoApellido) {
      console.log(query.include[0].include[0].where[Op.and][0]);
      query.include[0].include[0].where[Op.and][2].segundoApellido = null;
    }

    const result = await denuncia.findAll(query);

    if (!result) return null;

    return result;
  }

  async function listar (params = {}) {
    const query = getQuery(params);
    query.attributes = ['id', 'codigoRuv', 'relacionHecho', 'createdAt', 'estado'];
    query.where = {};
    query.include = [
      {
        model      : parametro,
        as         : 'parametroTipologiaPrincipal',
        attributes : ['nombre']
      },
      {
        model      : usuario,
        as         : 'usuario',
        attributes : ['id'],
        through    : {
          where: {
            estado: 'CREADO'
          }
        },
        include: {
          model      : rol,
          as         : 'roles',
          attributes : ['id', 'nombre']
        }
      }, //
      {
        model: victima,
        as: 'victimaDenuncia',
        attributes : ['id'],
        include:[
          {
            model: persona,
            as: 'victimaPersona',
            attributes : ['id', 'nombres', 'primerApellido', 'segundoApellido', 'numeroDocumento']
          },
          {
            model: dependiente,
            as: 'dependienteVictima',
            attributes : ['id']
          },
        ]
      }
    ];
    if (params.idDistrito) {
      query.where = {
        idDistrito: params.idDistrito,
      };
    }
    if (params.idMunicipio) {
      query.include.push({
        model : distrito,
        as    : 'distritoDenuncia',
        where : {
          idMunicipio: params.idMunicipio
        },
        attributes: ['id']
      });
    }

    if (params.codDepartamento) {
      query.include.push({
        model      : distrito,
        as         : 'distritoDenuncia',
        required   : true,
        attributes : ['id'],
        include    : {
          model      : municipio,
          as         : 'municipioDistrito',
          attributes : ['id'],
          where      : {
            codigoMunicipio: {
              [Op.like]: `${params.codDepartamento.slice(0, 2)}%`
            }
          }
        }
      });
    }

    // adm
    if (params.codigoDepartamento) {
      query.include.push({
        model      : distrito,
        as         : 'distritoDenuncia',
        required   : true,
        attributes : ['id'],
        include    : {
          model      : municipio,
          as         : 'municipioDistrito',
          attributes : ['id'],
          where      : {
            codigoMunicipio: {
              [Op.like]: `${params.codigoDepartamento}%`
            }
          }
        }
      });
    }

    if (params.codigoProvincia) {
      query.include.push({
        model      : distrito,
        as         : 'distritoDenuncia',
        required   : true,
        attributes : ['id'],
        include    : {
          model      : municipio,
          as         : 'municipioDistrito',
          attributes : ['id'],
          include : {
            model : dpa,
            as    : 'dpaMunicipio',
            attributes : ['codigo'],
            where : {
              codigoProvincia: params.codigoProvincia
            }
          }
        }
      });
    }

    if (params.codigoMunicipio) {
      query.include.push({
        model      : distrito,
        as         : 'distritoDenuncia',
        required   : true,
        attributes : ['id'],
        include    : {
          model      : municipio,
          as         : 'municipioDistrito',
          attributes : ['id'],
          where : {
            id: params.codigoMunicipio
          }
        }
      });
    }
    //adm

    if (params.codigoRuv) {
      query.where.codigoRuv = {
        [Op.iLike]: `%${params.codigoRuv}%`
      };
    }
    if (params.estado) {
      query.where.estado = params.estado;
    }

    if (params.nombreVictima) {
      query.include.push({
        model       : victima,
        as          : 'victimaDenuncia',
        attributes  : ['id'],
        required    : true,
        duplicating : false,
        include     : {
          model      : persona,
          as         : 'victimaPersona',
          attributes : ['id', 'nombres', 'primerApellido'],
          where      : {
            [Op.or]: [
              {
                nombres: {
                  [Op.iLike]: `%${params.nombreVictima}%`
                }
              },
              {
                primerApellido: {
                  [Op.iLike]: `%${params.nombreVictima}%`
                }
              },
              {
                segundoApellido: {
                  [Op.iLike]: `%${params.nombreVictima}%`
                }
              }
            ]
          }
        }
      });
    }
    if (params.nroDocumentoVictima) {
      query.include.push({
        model      : victima,
        as         : 'victimaDenuncia',
        attributes : ['id'],
        required   : true,
        duplicating : false,
        include    : [
          {
            model : persona,
            as    : 'victimaPersona',
            where : {
              numeroDocumento: {
                [Op.iLike]: `%${params.nroDocumentoVictima}%`
              }
            }
          }
        ]
      });
    }
    const result = await denuncia.findAndCountAll(query);
    return toJSON(result);
  }

  async function listarParaAsistencia (params = {}) {
    const query = getQuery(params);
    query.attributes = ['id', 'codigoRuv', 'createdAt', 'estado'];
    query.where = {};
    query.include = [
      {
        model: victima,
        as: 'victimaDenuncia',
        attributes : ['id'],
        include:[
          {
            model: persona,
            as: 'victimaPersona',
            attributes : ['id', 'nombres', 'primerApellido', 'segundoApellido', 'numeroDocumento']
          },
          {
            model: dependiente,
            as: 'dependienteVictima',
            attributes : ['id', 'relacionParentezco', 'idPersona'],
            include: [
              {
                model: parametro,
                as: 'parametroRelacionParentezco',
                attributes: ['id', 'codigo', 'nombre'],
                where: {
                  codigo: 'PTD-HIJ' // Relación debe ser "hijo"
                },
              }
            ],
            //required: true, //solo si hay dependientes
          }
        ]
      },
      {
        model: denunciado,
        as: 'denunciadoDenuncia',
        attributes : ['id', 'relacionParentezco'],
        include:[
          {
            model: persona,
            as: 'denunciadoPersona',
            attributes : ['id', 'nombres', 'primerApellido', 'segundoApellido', 'numeroDocumento']
          },
          {
            model: parametro,
            as: 'parametroRelacionParentezco',
            attributes : ['id', 'codigo', 'nombre'],
            where : {
              codigo: {
                [Op.in]: ['RVI-ESP', 'RVI-CON'] // Si es esposo o conviviente
              }
            }
          }
        ]
      }
    ];
    query.distinct = true
    if (params.idDistrito) {
      query.where = {
        ...query.where,
        idDistrito: params.idDistrito,
      };
    }
    if (params.idMunicipio) {
      query.include.push({
        model : distrito,
        as    : 'distritoDenuncia',
        where : {
          idMunicipio: params.idMunicipio
        },
        attributes: ['id']
      });
    }

    if (params.codDepartamento) {
      query.include.push({
        model      : distrito,
        as         : 'distritoDenuncia',
        required   : true,
        attributes : ['id'],
        include    : {
          model      : municipio,
          as         : 'municipioDistrito',
          attributes : ['id'],
          where      : {
            codigoMunicipio: {
              [Op.like]: `${params.codDepartamento.slice(0, 2)}%`
            }
          }
        }
      });
    }

    if (params.codigoRuv) {
      query.where.codigoRuv = {
        [Op.iLike]: `%${params.codigoRuv}%`
      };
    }
    if (params.estado) {
      query.where.estado = params.estado;
    }

    if(params.nombreVictima || params.nroDocumentoVictima) {

      const wherePersona = {}

      if (params.nombreVictima) {
        wherePersona[Op.or] = [
          { nombres: { [Op.iLike]: `%${params.nombreVictima}%` } },
          { primerApellido: { [Op.iLike]: `%${params.nombreVictima}%` } },
          { segundoApellido: { [Op.iLike]: `%${params.nombreVictima}%` } }
        ];
      }

      if (params.nroDocumentoVictima) {
        wherePersona.numeroDocumento = { [Op.iLike]: `%${params.nroDocumentoVictima}%` };
      }

      query.include.push({
        model       : victima,
        as          : 'victimaDenuncia',
        attributes  : ['id'],
        required    : true,
        duplicating : false,
        include     : {
          model      : persona,
          as         : 'victimaPersona',
          attributes : ['id', 'nombres', 'primerApellido', 'segundoApellido'],
          where      : wherePersona
        }
      });

    }

    const result = await denuncia.findAndCountAll(query);
    return toJSON(result);
  }


  async function listarPorUsuario (idUsuario, params = {}) {
    const query = getQuery(params);
    query.attributes = ['id', 'codigoRuv', 'relacionHecho', 'createdAt', 'estado', '_user_created'];
    query.where = {};
    query.include = [
      {
        model      : parametro,
        as         : 'parametroTipologiaPrincipal',
        attributes : ['nombre']
      },
      {
        model      : usuario,
        as         : 'usuario',
        attributes : ['id'],
        through    : {
          where: {
            estado: 'CREADO',
          }
        },
        include: {
          model      : rol,
          as         : 'roles',
          attributes : ['id', 'nombre']
        }
      }
    ];
    if (params.idDistrito) {
      query.where = {
        idDistrito: params.idDistrito,
        _user_created: idUsuario
      };
    }
    if (params.idMunicipio) {
      query.include.push({
        model : distrito,
        as    : 'distritoDenuncia',
        where : {
          idMunicipio: params.idMunicipio
        },
        attributes: ['id']
      });
    }

    if (params.codDepartamento) {
      query.include.push({
        model      : distrito,
        as         : 'distritoDenuncia',
        required   : true,
        attributes : ['id'],
        include    : {
          model      : municipio,
          as         : 'municipioDistrito',
          attributes : ['id'],
          where      : {
            codigoMunicipio: {
              [Op.like]: `${params.codDepartamento.slice(0, 2)}%`
            }
          }
        }
      });
    }

    if (params.codigoRuv) {
      query.where.codigoRuv = {
        [Op.iLike]: `%${params.codigoRuv}%`
      };
    }
    if (params.estado) {
      query.where.estado = params.estado;
    }

    if (params.nombreVictima) {
      query.include.push({
        model       : victima,
        as          : 'victimaDenuncia',
        attributes  : ['id'],
        required    : true,
        duplicating : false,
        include     : {
          model      : persona,
          as         : 'victimaPersona',
          attributes : ['id', 'nombres', 'primerApellido'],
          where      : {
            [Op.or]: [
              {
                nombres: {
                  [Op.iLike]: `%${params.nombreVictima}%`
                }
              },
              {
                primerApellido: {
                  [Op.iLike]: `%${params.nombreVictima}%`
                }
              },
              {
                segundoApellido: {
                  [Op.iLike]: `%${params.nombreVictima}%`
                }
              }
            ]
          }
        }
      });
    }
    if (params.nroDocumentoVictima) {
      query.include.push({
        model      : victima,
        as         : 'victimaDenuncia',
        attributes : ['id'],
        required   : true,
        duplicating : false,
        include    : {
          model : persona,
          as    : 'victimaPersona',
          attributes : ['id', 'numeroDocumento'],
          where : {
            numeroDocumento: {
              [Op.iLike]: `%${params.nroDocumentoVictima}%`
            }
          }
        }
    });

    }
    const result = await denuncia.findAndCountAll(query);
    return toJSON(result);
  }

  async function buscarPersona (numeroDocumento) {
    const query = {
      attributes : ['id', 'nombres', 'primerApellido', 'segundoApellido', 'numeroDocumento', 'fechaNacimiento'],
      where      : {
        numeroDocumento
      }
    };
    const result = await persona.findOne(query);
    if (result) return result.toJSON();
    return null;
  }

  async function obtenerVictima (idDenuncia) {
    const query = {
      attributes : ['id', 'codigoRuv', 'relacionHecho'],
      include    : [
        {
          model      : victima,
          as         : 'victimaDenuncia',
          attributes : ['id'],
          include    : [
            {
              model      : persona,
              as         : 'victimaPersona',
              attributes : ['numeroDocumento', 'fechaNacimiento', 'nombres', 'primerApellido', 'segundoApellido']
            }
          ]
        },
        {
          model      : distrito,
          as         : 'distritoDenuncia',
          attributes : ['id', 'nombre'],
          include    : [
            {
              model      : municipio,
              as         : 'municipioDistrito',
              attributes : ['nombre', 'codigoMunicipio'],
              include    : {
                model      : dpa,
                as         : 'dpaMunicipio',
                attributes : ['departamento', 'provincia', 'municipio']
              }
            }
          ]
        }
      ],
      where: {
        id: idDenuncia
      }
    };
    const result = await denuncia.findOne(query);

    if (!result) return null;

    return result;
  }

  async function obtenerDenunciados (idDenuncia) {
    const query = {
      attributes : ['id', 'codigoRuv', 'relacionHecho', 'createdAt'],
      include    : [
        {
          model      : denunciado,
          as         : 'denunciadoDenuncia',
          attributes : ['id'],
          include    : [
            {
              model      : persona,
              as         : 'denunciadoPersona',
              attributes : ['numeroDocumento', 'fechaNacimiento', 'nombres', 'primerApellido', 'segundoApellido']
            },
            {
              model : parametro,
              as    : 'parametroTipoDenunciado'
            }
          ]
        },
        {
          model      : distrito,
          as         : 'distritoDenuncia',
          attributes : ['id', 'nombre'],
          include    : [
            {
              model      : municipio,
              as         : 'municipioDistrito',
              attributes : ['nombre', 'codigoMunicipio'],
              include    : {
                model      : dpa,
                as         : 'dpaMunicipio',
                attributes : ['departamento', 'provincia', 'municipio']
              }
            }
          ]
        },
        {
          model      : parametro,
          as         : 'parametroTipologiaPrincipal',
          attributes : ['nombre']
        }
      ],
      where: {
        id: idDenuncia
      }
    };
    const result = await denuncia.findAll(query);

    if (!result) return null;

    return result;
  }

  async function generarReporteDetalle (params = {}, datosUsuario) {
    try {
      // eslint-disable-next-line max-len
      const select = 'select d."id_distrito", d.codigo_ruv, to_char(d."_created_at", \'DD/MM/YYYY\') fecha_creacion, to_char(d.fecha_hecho, \'DD/MM/YYYY\') as fecha_hecho , rtrim(concat(p.nombres, \' \', p.primer_apellido, \' \',p.segundo_apellido)) as nombres_apellidos_victima, p.numero_documento as numero_documento_victima, to_char(p.fecha_nacimiento, \'DD/MM/YYYY\') as fecha_nacimiento_victima, sp.nombre as tipologia, d.estado, rtrim(concat(p2.nombres, \' \', p2.primer_apellido, \' \',p2.segundo_apellido)) as nombres_apellidos_denunciado, p2.numero_documento as numero_documento_denunciado, to_char(p2.fecha_nacimiento, \'DD/MM/YYYY\') as fecha_nacimiento_denunciado, sp2.nombre as relacion_parentesco_denunciado, to_char(tmp.fecha_seguimiento, \'DD/MM/YYYY\') as fecha_seguimiento';
      const selectCount = 'select count(1) as total';
      let query = `
        from denuncia d
        inner join victima v on d.id = v."id_denuncia"
        inner join denunciado d2 on d.id = d2."id_denuncia"
        inner join sys_parametro sp ON d."tipologia_principal" = sp.id
        inner join distrito d3 on d."id_distrito" = d3.id
        inner join municipio m on d3."id_municipio" = m.id
        inner join sys_dpa sd on m."codigo_municipio" = sd.codigo
        left join persona p on v."id_persona" = p.id
        left join persona p2 on d2."id_persona" = p2.id
        left join sys_parametro sp2 on d2."relacion_parentezco" = sp2.id
        left join (select inst."id_denuncia", max(inst."_created_at") as fecha_seguimiento from (
          select id, "_created_at", "id_denuncia"
          from ficha_psicologica fp
          union
          select id, "_created_at", "id_denuncia"
          from ficha_seguimiento_psicologico fsp
          union
          select id, "_created_at", "id_denuncia"
          from informe_psicologico ip
          union
          select id, "_created_at", "id_denuncia"
          from terapia_slim ts
          union
          select id, "_created_at", "id_denuncia"
          from informe_legal il
          union
          select id, "_created_at" , "id_denuncia"
          from ficha_seguimiento_legal fsl
          union
          select id, "_created_at", "id_denuncia"
          from memorial m
          union
          select id, "_created_at", "id_denuncia"
          from informe_social is2
          union
          select id, "_created_at", "id_denuncia"
          from ficha_seguimiento_social fss
          union
          select id, "_created_at", "id_denuncia"
          from ficha_social fs2
          union
          select id, "_created_at", "id_denuncia"
          from ficha_visita_social fvs
          union
          select id, "_created_at", "id_denuncia"
          from nota_externa ne
          union
          select id, "_created_at", "id_denuncia"
          from terapia_externa te
          union
          select id, "_created_at", "id_denuncia"
          from certificado_medico cm
          union
          select id, "_created_at", "id_denuncia"
          from citacion c) as inst group by inst."id_denuncia") tmp on d.id = tmp."id_denuncia"
        `;

      if (datosUsuario.idDistrito || params.idSlim) {
        query = `${query} where d."id_distrito" = :idDistrito`;
      }  else if (params.idRed && !params.idMunicipio) {
        query = `${query} where m.red = :idRed`;
      } else if (datosUsuario.idMunicipio || params.idMunicipio) {
        query = `${query} where d3."id_municipio" = :idMunicipio`;
      } else if (datosUsuario.codDepartamento || params.codDepartamento) {
        query = `${query} where sd.codigo like :codDepartamento`;
      } else {
        query = `${query} where 1 = 1`;
      }
      // if (params.fechaDesde) {
      //   query = `${query} and d."_created_at" >= :fechaDesde`;
      // }
      // if (params.fechaHasta) {
      //   query = `${query} and d."_created_at" <= :fechaHasta`;
      // }
      if (params.fechaDesde) {
        query = `${query} and d.fecha_hecho >= :fechaDesde`;
      }
      if (params.fechaHasta) {
        query = `${query} and d.fecha_hecho <= :fechaHasta`;
      }
      if (params.estado) {
        query = `${query} and d.estado = :estado`;
      }
      if (params.edadDesde) {
        query = `${query} and date_part('YEAR', age(p.fecha_nacimiento)) >= :edadDesde`;
      }
      if (params.edadHasta) {
        query = `${query} and date_part('YEAR', age(p.fecha_nacimiento)) <= :edadHasta`;
      }
      if (params.embarazo) {
        query = `${query} and embarazo = :embarazo`;
      }
      if (params.parentezco) {
        query = `${query} and d2."relacion_parentezco" = :parentezco`;
      }
      if (params.tipologia) {
        query = `${query} and d."tipologia_principal" = :tipologia`;
      }
      if (params.ile) {
        query = `${query} and d.id = (select "id_denuncia" from interrupcion_legal_embarazo ile where ile."id_denuncia" = d.id)`;
      }
      if (params.terapiaExterna) {
        query = `${query} and d.id = (select "id_denuncia" from terapia_externa te where te."id_denuncia" = d.id)`;
      }
      if (params.terapiaSlim) {
        query = `${query} and d.id = (select "id_denuncia" from terapia_slim ts where ts."id_denuncia" = d.id)`;
      }

      if (params.seguimiento) {
        if (params.seguimiento === 'C') {
          query = `${query} and tmp.fecha_seguimiento is not null`;
        } else if (params.seguimiento === 'S') {
          query = `${query} and tmp.fecha_seguimiento is null`;
        }
      }

      const queryTotal = `${selectCount} ${query}`;
      const options = {
        type         : QueryTypes.SELECT,
        replacements : {
          idDistrito      : params.idSlim ? params.idSlim : datosUsuario.idDistrito,
          idMunicipio     : params.idMunicipio ? params.idMunicipio : datosUsuario.idMunicipio,
          codDepartamento : params.codDepartamento ? `${params.codDepartamento}%` : (datosUsuario.codDepartamento ? `${datosUsuario.codDepartamento.substring(0, 2)}%` : null),
          idRed           : params.idRed,
          fechaDesde      : `${formatearFecha(params.fechaDesde)} 00:00:00`,
          fechaHasta      : `${formatearFecha(params.fechaHasta)} 23:59:59`,
          estado          : params.estado,
          edadDesde       : params.edadDesde,
          edadHasta       : params.edadHasta,
          embarazo        : params.embarazo,
          parentezco      : params.parentezco,
          tipologia       : params.tipologia
        }
      };
      const [count] = await sequelize.query(queryTotal, options);
      query = `${select} ${query}`;
      if (params.limit && params.page) {
        query = `${query} order by d.codigo_ruv asc offset :offset limit :limit`;
        console.log(params);
        options.replacements.limit = params.limit;
        options.replacements.offset = params.limit * (params.page - 1);
      }
      const denuncias = await sequelize.query(query, options);

      return {
        count : count.total,
        rows  : denuncias
      };
    } catch (error) {
      console.log(error);
    }
  }

  async function generarReporteEstadistico (params = {}, datosUsuario) {
    try {
      // eslint-disable-next-line max-len
      /* let query = `
      select d."idDistrito", d.codigo_ruv, to_char(d."_created_at", 'DD/MM/YYYY') fecha_creacion, to_char(d.fecha_hecho, 'DD/MM/YYYY') as fecha_hecho , rtrim(concat(p.nombres, ' ', p.primer_apellido, ' ',p.segundo_apellido)) as nombres_apellidos_victima, p.numero_documento as numero_documento_victima, to_char(p.fecha_nacimiento, 'DD/MM/YYYY') as fecha_nacimiento_victima, sp.nombre as tipologia, d.estado, rtrim(concat(p2.nombres, ' ', p2.primer_apellido, ' ',p2.segundo_apellido)) as nombres_apellidos_denunciado, p2.numero_documento as numero_documento_denunciado, to_char(p2.fecha_nacimiento, 'DD/MM/YYYY') as fecha_nacimiento_denunciado, sp2.nombre as relacion_parentesco_denunciado
      from denuncia d
      inner join victima v on d.id = v."idDenuncia"
      inner join denunciado  d2 on d.id = d2."idDenuncia"
      inner join sys_parametro sp ON d."tipologiaPrincipal" = sp.id
      inner join distrito d3 on d."idDistrito" = d3.id
      inner join municipio m on d3."idMunicipio" = m.id
      inner join sys_dpa sd on m."codigoMunicipio" = sd.codigo
      left join persona p on v."idPersona" = p.id
      left join persona p2 on d2."idPersona" = p2.id
      left join sys_parametro sp2 on d2."relacionParentezco" = sp2.id`; */
      let query = `
        select sp.nombre, count(sp.nombre)
        from denuncia d
        inner join sys_parametro sp3 on d."tipologia_principal" = sp3.id
        inner join victima v on d.id = v."id_denuncia"
        inner join denunciado  d2 on d.id = d2."id_denuncia"
        inner join sys_parametro sp ON d."tipologia_principal" = sp.id
        inner join distrito d3 on d."id_distrito" = d3.id
        inner join municipio m on d3."id_municipio" = m.id
        inner join sys_dpa sd on m."codigo_municipio" = sd.codigo
        left join persona p on v."id_persona" = p.id
        left join persona p2 on d2."id_persona" = p2.id
        left join sys_parametro sp2 on d2."relacion_parentezco" = sp2.id
        left join (select inst."id_denuncia", max(inst."_created_at") as fecha_seguimiento from (
          select id, "_created_at", "id_denuncia"
          from ficha_psicologica fp
          union
          select id, "_created_at", "id_denuncia"
          from ficha_seguimiento_psicologico fsp
          union
          select id, "_created_at", "id_denuncia"
          from informe_psicologico ip
          union
          select id, "_created_at", "id_denuncia"
          from terapia_slim ts
          union
          select id, "_created_at", "id_denuncia"
          from informe_legal il
          union
          select id, "_created_at" , "id_denuncia"
          from ficha_seguimiento_legal fsl
          union
          select id, "_created_at", "id_denuncia"
          from memorial m
          union
          select id, "_created_at", "id_denuncia"
          from informe_social is2
          union
          select id, "_created_at", "id_denuncia"
          from ficha_seguimiento_social fss
          union
          select id, "_created_at", "id_denuncia"
          from ficha_social fs2
          union
          select id, "_created_at", "id_denuncia"
          from ficha_visita_social fvs
          union
          select id, "_created_at", "id_denuncia"
          from nota_externa ne
          union
          select id, "_created_at", "id_denuncia"
          from terapia_externa te
          union
          select id, "_created_at", "id_denuncia"
          from certificado_medico cm
          union
          select id, "_created_at", "id_denuncia"
          from citacion c) as inst group by inst."id_denuncia") tmp on d.id = tmp."id_denuncia"
        where sp3.id = :tipologia`;

      /* if (id_distrito) {
        query = `${query} and d.id_distrito = :id_distrito`;
      } */
      if (datosUsuario.idDistrito || params.idSlim) {
        query = `${query} and d."id_distrito" = :idDistrito`;
      } else if (params.idRed  && !params.idMunicipio) {
        query = `${query} and m.red = :idRed`;
      } else if (datosUsuario.idMunicipio || params.idMunicipio) {
        query = `${query} and d3."id_municipio" = :idMunicipio`;
      } else if (datosUsuario.codDepartamento || params.codDepartamento) {
        query = `${query} and sd.codigo like :codDepartamento`;
      }
      if (params.fechaDesde) {
        query = `${query} and d."_created_at" >= :fechaDesde`;
      }
      if (params.fechaHasta) {
        query = `${query} and d."_created_at" <= :fechaHasta`;
      }
      if (params.estado) {
        query = `${query} and d.estado = :estado`;
      }
      if (params.edadDesde) {
        query = `${query} and date_part('YEAR', age(p.fecha_nacimiento)) >= :edadDesde`;
      }
      if (params.edadHasta) {
        query = `${query} and date_part('YEAR', age(p.fecha_nacimiento)) <= :edadHasta`;
      }
      if (params.embarazo) {
        query = `${query} and embarazo = :embarazo`;
      }
      if (params.parentezco) {
        query = `${query} and d2."relacion_parentezco" = :parentezco`;
      }
      if (params.tipologia) {
        query = `${query} and d."tipologia_principal" = :tipologia`;
      }
      if (params.ile) {
        query = `${query} and d.id = (select "id_denuncia" from interrupcion_legal_embarazo ile where ile."id_denuncia" = d.id)`;
      }
      if (params.terapiaExterna) {
        query = `${query} and d.id = (select "id_denuncia" from terapia_externa te where te."id_denuncia" = d.id)`;
      }
      if (params.terapiaSlim) {
        query = `${query} and d.id = (select "id_denuncia" from terapia_slim ts where ts."id_denuncia" = d.id)`;
      }
      if (params.seguimiento) {
        if (params.seguimiento === 'C') {
          query = `${query} and tmp.fecha_seguimiento is not null`;
        } else if (params.seguimiento === 'S') {
          query = `${query} and tmp.fecha_seguimiento is null`;
        }
      }

      query = `${query} group by sp.nombre`;

      const denuncias = await sequelize.query(query, {
        type         : QueryTypes.SELECT,
        replacements : {
          idDistrito      : params.idSlim ? params.idSlim : datosUsuario.idDistrito,
          idMunicipio     : params.idMunicipio ? params.idMunicipio : datosUsuario.idMunicipio,
          codDepartamento : params.codDepartamento ? `${params.codDepartamento}%` : (datosUsuario.codDepartamento ? `${datosUsuario.codDepartamento.substring(0, 2)}%` : null),
          idRed           : params.idRed,
          fechaDesde      : `${formatearFecha(params.fechaDesde)} 00:00:00`,
          fechaHasta      : `${formatearFecha(params.fechaHasta)} 23:59:59`,
          estado          : params.estado,
          edadDesde       : params.edadDesde,
          edadHasta       : params.edadHasta,
          embarazo        : params.embarazo,
          parentezco      : params.parentezco,
          tipologia       : params.tipologia
        }
      });
      return denuncias;
    } catch (error) {
      console.log(error);
    }
  }

    async function generarReporteGeneral (params = {}) {
    try {
      const query = `
        select 	sd.departamento,
            m.nombre as municipio,
            d2.nombre as slim,
            d.codigo_ruv,
            to_char(d.fecha_hecho, 'DD/MM/YYYY') as fecha_hecho,
            to_char(d."_created_at", 'DD/MM/YYYY') as fecha_registro,
            sp1.nombre as tipologia_principal,
            sp2.nombre as tipologia_secundaria,
            to_char(p.fecha_nacimiento, 'DD/MM/YYYY') as victima_fecha_nacimiento,
            date_part('YEAR', age(p.fecha_nacimiento)) as victima_edad,
            coalesce(case when v.embarazo then 'SI' else 'NO' end, 'NO') as victima_embarazo,
            tvpv.victima_poblacion_vulnerable,
            vvai.victima_autoidentificacion_originaria,
            ile.victima_cantidad_ile,
            case when af.asistencia_familiar IS null then 'NO' else 'SI' end as asistencia_familiar,
            tpd.tipo_denunciante as tipo_denunciante,
                coalesce(tmp.cantidad_dependientes, 0) as cantidad_dependientes,
                coalesce(tmph.cantidad_hijos, 0) as cantidad_hijos,
                dnd.cantidad_denunciados,
                tdnd.tipos_denunciados,
                gdnd.genero_denunciados,
                pdnd.relacion_parentesco_denunciados,
                fdnd.fecha_nacimiento_denunciados,
                fdnd.edad_denunciados
                from denuncia d
                left join sys_parametro sp1 on d."tipologia_principal" = sp1.id
                left join sys_parametro sp2 on d."tipologia_secundaria" = sp2.id
                left join distrito d2 on d."id_distrito" = d2.id
                left join municipio m on d2."id_municipio" = m.id
                left join sys_dpa sd on m."codigo_municipio" = sd.codigo
                left join victima v on d.id = v."id_denuncia"
                left join persona p on v."id_persona" = p.id
                left join denunciante d4 on d.id = d4.id_denuncia

                left join (
                  select "id_denuncia", count("id_denuncia") as cantidad_denunciados
                  from denunciado d3
                  group by d3."id_denuncia"
                ) dnd on d.id = dnd."id_denuncia"

                left join (
                  select de.id_denuncia, STRING_AGG(sp.nombre, ', ') as tipos_denunciados
                  from denunciado de
                  inner join sys_parametro sp on de.tipo_denunciado = sp.id
                  group by de.id_denuncia
                ) tdnd on d.id = tdnd.id_denuncia

                left join (
                  select de.id_denuncia, STRING_AGG(sp.nombre, ', ') as genero_denunciados
                  from denunciado de
                  inner join persona p on de.id_persona = p.id
                  inner join sys_parametro sp on p.genero = sp.id
                  group by de.id_denuncia
                ) gdnd on d.id = gdnd.id_denuncia

                left join (
                  select de.id_denuncia, STRING_AGG(sp.nombre, ', ') as relacion_parentesco_denunciados
                  from denunciado de
                  inner join sys_parametro sp on de.relacion_parentezco = sp.id
                  group by de.id_denuncia
                ) pdnd on d.id = pdnd.id_denuncia

                left join (
                  select de.id_denuncia, STRING_AGG(TO_CHAR(p.fecha_nacimiento, 'DD/MM/YYYY'), ', ') as fecha_nacimiento_denunciados,
                  STRING_AGG(date_part('YEAR', age(p.fecha_nacimiento))::TEXT, ', ') AS edad_denunciados
                  from denunciado de
                  inner join persona p on de.id_persona = p.id
                  group by de.id_denuncia
                ) fdnd on d.id = fdnd.id_denuncia

                left join (
                  select "id_victima", count("id_victima") as cantidad_dependientes
                  from dependiente d3
                  group by d3."id_victima"
                ) tmp on v.id = tmp."id_victima"

                left join (
                  select "id_victima", count("id_victima") as cantidad_hijos
                  from dependiente d
                  inner join sys_parametro sp on d.relacion_parentezco = sp.id
                  where sp.codigo = 'PTD-HIJ'
                  group by d."id_victima"
                ) tmph on v.id = tmph."id_victima"

                left join (
                  select vpv.id_victima, STRING_AGG(sp.nombre, ', ') as victima_poblacion_vulnerable
                  from victima_poblacion_vulnerable vpv
                  inner join sys_parametro sp on vpv.id_poblacion_vulnerable = sp.id
                  where vpv."_deleted_at" is null
                  group by vpv.id_victima
                ) tvpv on v.id = tvpv.id_victima

                left join (
                  select id_victima, STRING_AGG(sp.nombre, ', ') as victima_autoidentificacion_originaria
                  from victima_auto_identificacion vai
                  inner join sys_parametro sp on vai.id_auto_identificacion = sp.id
                  where vai."_deleted_at" is null
                  group by vai.id_victima
                ) vvai on v.id = vvai.id_victima

                left join (
                  select "id_denuncia", count("id_denuncia") as total
                  from solicitud_atencion sa
                  group by sa."id_denuncia"
                ) tmpsa on d.id = tmpsa."id_denuncia"

                left join (
                  select id, nombre as tipo_denunciante
                  from sys_parametro sp
                ) tpd on d4.tipo_denunciante = tpd.id

                left join (
                  select "id_denuncia", count("id_denuncia") as total
                  from (
                    select "id_denuncia", "id"
                    from ficha_referencia fr
                    union
                    select "id_denuncia", "id"
                    from ficha_contrareferencia fc) as tmpfrc
                  group by "id_denuncia"
                ) tmpfrfcrf on d.id = tmpfrfcrf."id_denuncia"

                left join (
                  select id_denuncia, count(id_denuncia) as victima_cantidad_ile
                  from interrupcion_legal_embarazo ile
                  group by ile."id_denuncia"
                ) ile on d.id = ile.id_denuncia

                left join (
                  select id_denuncia, count(id_denuncia) as asistencia_familiar
                  from asistencia_familiar af
                  group by af.id_denuncia
                ) af on d.id = af.id_denuncia

                where d."_created_at" >= :fechaInicio and d."_created_at" <= :fechaFin;
        `;
      const options = {
        type         : QueryTypes.SELECT,
        replacements : {
          fechaInicio : `${formatearFecha(params.fechaInicio)} 00:00:00`,
          fechaFin : `${formatearFecha(params.fechaFin)} 23:59:59`
        }
      };
      const resultados = await sequelize.query(query, options);
      return resultados;
    } catch (error) {
      console.log(error);
    }
  }

  // Obtener secuencial por departamento
  // async function obtenerSecuencial (codigoDepartamento, anio) {
  //   const query = `
  //     select max(d.secuencial::integer)
  //     from denuncia d, distrito d2, municipio m
  //     where d."idDistrito" = d2.id
  //     and d2."idMunicipio" = m.id
  //     and m."codigoMunicipio" like '${codigoDepartamento}%'
  //     and date_part('YEAR', d."_created_at") = ${anio};`;
  //   const resultado = await sequelize.query(query, { type: QueryTypes.SELECT });
  //   return resultado;
  // }

  async function obtenerSecuencial (anio) {
    const query = `
      select max(d.secuencial::integer)
      from denuncia d, distrito d2, municipio m
      where d."id_distrito" = d2.id
      and d2."id_municipio" = m.id
      and date_part('YEAR', d."_created_at") = ${anio};`;
    const resultado = await sequelize.query(query, { type: QueryTypes.SELECT });
    return resultado;
  }

  async function obtener (idDenuncia) {
    const query = {
      where: {
        id: idDenuncia
      },
      include: [
        {
          model   : distrito,
          as      : 'distritoDenuncia',
          include : {
            model   : municipio,
            as      : 'municipioDistrito',
            include : {
              model : dpa,
              as    : 'dpaMunicipio'
            }
          }
        }
      ]
    };

    const result = await denuncia.findOne(query);

    if (!result) return null;

    return result.toJSON();
  }

  async function obtenerCodigoDenuncia (idDenuncia) {
    const query = {
      where: {
        id: idDenuncia
      },
      attributes : ['id', 'codigoRuv'],
    };

    const result = await denuncia.findOne(query);

    if (!result) return null;

    return result.toJSON();
  }

  async function getDenunciasPorAnio (idDistrito) {
    const result = await denuncia.findAll({
      attributes: [
        [sequelize.fn('DATE_PART', 'year', sequelize.col('_created_at')), 'anio'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'total_denuncias'],
        [sequelize.fn('MAX', sequelize.col('_created_at')), 'fecha_ultimo_registro'],
      ],
      group: [sequelize.fn('DATE_PART', 'year', sequelize.col('_created_at'))],
      order: [[sequelize.fn('DATE_PART', 'year', sequelize.col('_created_at')), 'ASC']],
      where: {
        idDistrito: idDistrito
      },
    })
    return toJSONArray(result);
  }

  async function getTopTipologiasPorAnio (idDistrito) {
    const result = await denuncia.findAll({
      attributes: [
        [sequelize.fn('DATE_PART', 'year', sequelize.col('denuncia._created_at')), 'anio'],
        'tipologia_principal',
        [sequelize.fn('COUNT', sequelize.col('tipologia_principal')), 'cantidad'],
      ],
      include: [
        {
          model: parametro,
          as: 'parametroTipologiaPrincipal',
          attributes: ['nombre'],
        }
      ],
      group: [
        sequelize.fn('DATE_PART', 'year', sequelize.col('denuncia._created_at')),
        'tipologia_principal',
        'parametroTipologiaPrincipal.id',
        'parametroTipologiaPrincipal.nombre'
      ],
      order: [
        [sequelize.fn('DATE_PART', 'year', sequelize.col('denuncia._created_at')), 'ASC'],
        [sequelize.literal('cantidad'), 'DESC']
      ],
      where: {
        idDistrito: idDistrito
      },
    })

    const agrupadosPorAnio = result.reduce((acc, row) => {
      const data = row.get({ plain: true });
      if (!acc[data.anio]) {
        acc[data.anio] = [];
      }
      acc[data.anio].push(data);
      return acc;
    }, {});

    const topTipologiasPorAnio = Object.entries(agrupadosPorAnio).map(([anio, tipologias]) => ({
      anio,
      top_tipologias: tipologias.slice(0, 3),
    }));

    return topTipologiasPorAnio;
  }

  async function generarReporteNacionalDepartamental (params = {}) {
    try {

      // Armar condiciones para nacional y departamento
      const condicionesWhere = [
        `d."_created_at" >= :fechaInicio`,
        `d."_created_at" <= :fechaFin`
      ]

      const replacements = {
        fechaInicio: `${params.fechaInicio} 00:00:00`,
        fechaFin   : `${params.fechaFin} 23:59:59`,
      }

      if (params.codigoDepartamento) {
        condicionesWhere.push(`sd.codigo_departamento = :codigoDepartamento`)
        replacements.codigoDepartamento = params.codigoDepartamento
      }

      const clausulaWhere = condicionesWhere.join(' AND ')

      const query = `
        WITH registros AS (
          SELECT
            sd.departamento,
            sd.municipio as municipio,
            COUNT(d.id) AS cantidad_registros,
            COALESCE(u.total_usuarios, 0) AS total_usuarios_por_municipio,
            COALESCE(s.cantidad_slim, 0) AS cantidad_slim_por_municipio
          FROM denuncia d
          JOIN distrito d2 ON d."id_distrito" = d2.id
          JOIN municipio m ON d2."id_municipio" = m.id
          JOIN sys_dpa sd ON m."codigo_municipio" = sd.codigo
          LEFT JOIN (
            SELECT d2.id_municipio, COUNT(*) AS total_usuarios
            FROM sys_usuario su
            JOIN distrito d2 ON su.id_distrito = d2.id
            WHERE su.estado = 'ACTIVO'
            GROUP BY d2.id_municipio
          ) u ON m.id = u.id_municipio
          LEFT JOIN (
            SELECT id_municipio, COUNT(*) AS cantidad_slim
            FROM distrito
            GROUP BY id_municipio
          ) s ON m.id = s.id_municipio
          WHERE ${clausulaWhere}
          GROUP BY sd.departamento, sd.municipio, u.total_usuarios, s.cantidad_slim
        )
        SELECT
          departamento,
          municipio,
          cantidad_registros,
          total_usuarios_por_municipio,
          cantidad_slim_por_municipio
        FROM (
          SELECT r.*,
            SUM(cantidad_registros) OVER (PARTITION BY departamento) AS total_registros_departamento
          FROM registros r
        ) sub
        ORDER BY total_registros_departamento DESC, cantidad_registros DESC;
        `;

      const options = {
        type         : QueryTypes.SELECT,
        replacements : replacements
      };

      console.log("🚀 ~ generarReporteRegion ~ options:", options)
      const resultados = await sequelize.query(query, options);
      return resultados;
    } catch (error) {
      console.log(error);
    }
  }

  async function generarReporteMunicipal (params = {}) {
    const condicionesWhere = [
      `d."_created_at" >= :fechaInicio`,
      `d."_created_at" <= :fechaFin`
    ]

    const replacements = {
      fechaInicio: `${params.fechaInicio} 00:00:00`,
      fechaFin   : `${params.fechaFin} 23:59:59`,
    }

    if (params.codigoMunicipio) {
      condicionesWhere.push(`d.codigo_municipio = :codigoMunicipio`)
      replacements.codigoMunicipio = params.codigoMunicipio
    }
    const clausulaWhere = condicionesWhere.join(' AND ')
    try {
      const query = `
        SELECT
          sd.municipio,
          d2.id       AS id_slim,
          d2.nombre   AS slim,
          COUNT(*)    AS total_denuncias,
          COALESCE(su_activos.total_usuarios_activos, 0) AS total_usuarios_activos
        FROM denuncia d
        LEFT JOIN distrito    d2 ON d2.id               = d.id_distrito
        LEFT JOIN municipio   m  ON m.id                = d2.id_municipio
        LEFT JOIN sys_dpa     sd ON sd.codigo           = m.codigo_municipio
        LEFT JOIN (
          SELECT id_distrito, COUNT(*) AS total_usuarios_activos
          FROM sys_usuario
          WHERE estado = 'ACTIVO'
          GROUP BY id_distrito
        ) su_activos ON su_activos.id_distrito = d2.id
        WHERE ${clausulaWhere}
        GROUP BY
          sd.municipio,
          d2.id,
          d2.nombre,
          su_activos.total_usuarios_activos
        ORDER BY
          total_denuncias DESC;
      `
      const options = {
        type         : QueryTypes.SELECT,
        replacements : replacements
      };

      const resultados = await sequelize.query(query, options);
      return resultados;
    } catch (error) {
      console.log(error);
    }
  }

  async function generarReporteListadoNacionalDepartamental (params = {}) {
    try {

      // Armar condiciones para nacional y departamento
      const condicionesWhere = [
        `d."_created_at" >= :fechaInicio`,
        `d."_created_at" <= :fechaFin`
      ]

      const replacements = {
        fechaInicio: `${params.fechaInicio} 00:00:00`,
        fechaFin   : `${params.fechaFin} 23:59:59`,
      }

      if (params.codigoDepartamento) {
        condicionesWhere.push(`sd.codigo_departamento = :codigoDepartamento`)
        replacements.codigoDepartamento = params.codigoDepartamento
      }

      const clausulaWhere = condicionesWhere.join(' AND ')

      const query = `
        WITH conteos AS (
          SELECT
            sd.departamento,
            sd.municipio,
            COUNT(*) AS total_registros
          FROM denuncia d
            LEFT JOIN distrito d2 ON d.id_distrito = d2.id
            LEFT JOIN municipio m ON d2.id_municipio = m.id
            LEFT JOIN sys_dpa sd ON sd.codigo = m.codigo_municipio
          WHERE ${clausulaWhere}
          GROUP BY sd.departamento, sd.municipio
        ),
        conteo_departamento AS (
          SELECT
            departamento,
            SUM(total_registros) AS total_registros_departamento
          FROM conteos
          GROUP BY departamento
        )

        SELECT
          su.usuario,
          d.codigo_ruv,
          sp.nombre AS tipologia_principal,
          TO_CHAR(d.fecha_hecho, 'DD/MM/YYYY') AS fecha_hecho,
          TO_CHAR(d."_created_at", 'DD/MM/YYYY HH24:MI') AS fecha_registro,
          sd.departamento,
          sd.municipio,
          d2.nombre AS SLIM,
          d.estado
        FROM denuncia d
          LEFT JOIN sys_parametro sp ON sp.id = d.tipologia_principal
          LEFT JOIN distrito d2 ON d.id_distrito = d2.id
          LEFT JOIN municipio m ON d2.id_municipio = m.id
          LEFT JOIN sys_dpa sd ON sd.codigo = m.codigo_municipio
          LEFT JOIN sys_usuario su ON su.id = d."_user_created"
          LEFT JOIN conteos c ON c.departamento = sd.departamento AND c.municipio = sd.municipio
          LEFT JOIN conteo_departamento cd ON cd.departamento = sd.departamento
        WHERE ${clausulaWhere}
        ORDER BY
          cd.total_registros_departamento DESC, -- 1. Departamento con más registros primero
          sd.departamento ASC,                   -- 2. Nombre de departamento (por claridad interna)
          c.total_registros DESC,                 -- 3. Municipio con más registros en el departamento
          sd.municipio asc,						-- 4. Nombre del municipio (por claridad interna)
          d."_created_at" DESC;
      `;

      const options = {
        type         : QueryTypes.SELECT,
        replacements : replacements
      };

      const resultados = await sequelize.query(query, options);
      return resultados;
    } catch (error) {
      console.log(error);
    }
  }

  return {
    createOrUpdate: (item, t) => Repository.createOrUpdate(item, denuncia, t),
    // crear,
    buscarPorId,
    buscarPorNumeroDocumento,
    buscarPorNombreApellido,
    listar,
    listarPorUsuario,
    buscarPersona,
    obtenerVictima,
    obtenerDenunciados,
    obtenerDetalleDenuncia,
    obtenerDetalleVictima,
    obtenerDetalleDenunciados,
    obtenerDetalleDenunciante,
    generarReporteDetalle,
    generarReporteEstadistico,
    generarReporteGeneral,
    obtenerSecuencial,
    obtener,
    listarParaAsistencia,
    obtenerCodigoDenuncia,
    getDenunciasPorAnio,
    getTopTipologiasPorAnio,
    generarReporteNacionalDepartamental,
    generarReporteMunicipal,
    generarReporteListadoNacionalDepartamental
  };
};
