'use strict';

const Repository = require('../Repository');
const { toJSONArray, toJSON } = require('../../lib/util');

module.exports = function solicitudAtencionRepository (models, Sequelize) {
  const { solicitudAtencion, distrito, municipio, denuncia, dpa, parametro, solicitudTransferencia } = models;
  const attributes = { exclude: ['updatedAt', 'deletedAt', 'idDenuncia', 'userCreated', 'userUpdated', 'userDeleted'] };

  async function obtenerSolicitudesPorDenuncia (idDenuncia) {
    const query = {
      attributes : ['id', 'observaciones', 'profesional', 'createdAt', 'estado'],
      where      : {
        idDenuncia
      },
      include: [{
        model      : distrito,
        as         : 'distritoSolicitudAtencion',
        attributes : ['id', 'nombre'],
        include    : {
          model      : municipio,
          as         : 'municipioDistrito',
          attributes : ['id', 'nombre']
        }
      }, {
        model      : parametro,
        as         : 'parametroInstrumento',
        attributes : ['id', 'nombre']
      }]
    };

    const result = await solicitudAtencion.findAll(query);
    return toJSONArray(result);
  }

  async function listar (params) {
    console.log("🚀 ~ listar ~ params:", params)
    const query = {
      attributes : ['id', 'codigoRuv', 'createdAt'],
      include    : [
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
          model      : solicitudAtencion,
          as         : 'solicitudAtencionDenuncia',
          attributes : ['id', 'createdAt', 'observaciones'],
          where      : {
            usuarioId : params.usuarioId,
            estado    : 'CREADO'
          },
          include: {
            model      : parametro,
            as         : 'parametroInstrumento',
            attributes : ['id', 'nombre']
          }
        }
      ]
    };
    const result = await denuncia.findAndCountAll(query);
    return toJSON(result);
  }

  return {
    createOrUpdate : (item, t) => Repository.createOrUpdate(item, solicitudAtencion, t),
    findById       : id => Repository.findById(id, solicitudAtencion, attributes),
    obtenerSolicitudesPorDenuncia,
    listar
  };
};
