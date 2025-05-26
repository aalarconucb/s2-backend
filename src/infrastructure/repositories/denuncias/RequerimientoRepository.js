'use strict';

const Repository = require('../Repository');
const { getQuery, toJSON } = require('../../lib/util');
const { formatearFecha } = require('../../lib/date');

module.exports = function requerimientoInformeRepository (models, Sequelize) {
  const { requerimientoInforme, distrito, municipio } = models;
  const { Op } = Sequelize;
  const attributes = { exclude: ['updatedAt', 'deletedAt', 'idDenuncia', 'userCreated', 'userUpdated', 'userDeleted'] };

  async function listar (params = {}) {
    const query = getQuery(params)
    query.attributes = [
      'id',
      'fecha',
      'tipo',
      'entidadSolicitante',
      'autoridadSolicitante',
      'descripcion',
      'createdAt',
      'rutaDocumento',
      'estado'
    ]

    if (params.idDistrito) {
      query.where = {
        idDistrito: params.idDistrito
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

    if (params.tipo) {
      query.where = {
        tipo: params.tipo
      };
    }
    if (params.autoridadSolicitante) {
      query.where = {
        autoridadSolicitante: { [Op.iLike]: `%${params.autoridadSolicitante}%` }
      };
    }
    if (params.fechaInicio && params.fechaFin) {
      query.where.createdAt = {
        [Op.between]: [
          `${formatearFecha(params.fechaInicio)} 00:00:00`,
          `${formatearFecha(params.fechaFin)} 23:59:59`
        ]
      };
    }
    const result = await requerimientoInforme.findAndCountAll(query);
    return toJSON(result);
  }

  return {
    createOrUpdate : (item, t) => Repository.createOrUpdate(item, requerimientoInforme, t),
    findById       : id => Repository.findById(id, requerimientoInforme, attributes),
    listar
  };
};