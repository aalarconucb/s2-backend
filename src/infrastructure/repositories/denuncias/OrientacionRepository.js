'use strict';

const Repository = require('../Repository');
const { getQuery, toJSON } = require('../../lib/util');
const { formatearFecha } = require('../../lib/date');

module.exports = function orientacionRepository (models, Sequelize, sequelize) {
  const { orientacion, distrito, municipio } = models;
  const { Op, QueryTypes } = Sequelize;
  const attributes = { exclude: ['updatedAt', 'deletedAt', 'userCreated', 'userUpdated', 'userDeleted'], include: ['nroOrientacion'] };

  async function listar (params = {}) {
    const query = getQuery(params)
    query.attributes = [
      'id',
      'fecha',
      'nroCaso',
      'lugar',
      'peticionario',
      'numeroDocumentoPeticionario',
      'relacionHecho',
      'peticion',
      'orientacionRecomendacionTecnica',
      'fechaOrientacion',
      'createdAt',
      'nroOrientacion',
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

    if (params.fechaInicio && params.fechaFin) {
      query.where.createdAt = {
        [Op.between]: [
          `${formatearFecha(params.fechaInicio)} 00:00:00`,
          `${formatearFecha(params.fechaFin)} 23:59:59`
        ]
      };
    }
    const result = await orientacion.findAndCountAll(query);
    return toJSON(result);
  }

  async function obtenerSecuencial (anio) {
    const query = `
      select max(o.secuencial::integer)
      from orientacion o, distrito d2, municipio m
      where o."id_distrito" = d2.id
      and d2."id_municipio" = m.id
      and date_part('YEAR', o."_created_at") = ${anio};`;
    const resultado = await sequelize.query(query, { type: QueryTypes.SELECT });
    return resultado;
  }

  return {
    createOrUpdate : (item, t) => Repository.createOrUpdate(item, orientacion, t),
    findById       : id => Repository.findById(id, orientacion, attributes),
    listar,
    obtenerSecuencial
  };
};
