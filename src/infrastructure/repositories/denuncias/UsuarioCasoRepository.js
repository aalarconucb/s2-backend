'use strict';

const Repository = require('../Repository');
const { toJSONArray } = require('../../lib/util');

module.exports = function usuarioCasoRepository (models, Sequelize) {
  const { usuarioCaso, denuncia, usuario, parametro } = models;

  async function listarAsignados (idUsuario) {
    const query = {
      attributes : ['id', 'codigoRuv', 'createdAt'],
      include    : [
      {
        model      : usuario,
        as         : 'usuario',
        required   : true,
        attributes : ['id'],
        where      : {
          id: idUsuario
        },
        through: {
          where: {
            estado: 'CREADO'
          }
        }
      },
      {
        model      : parametro,
        as         : 'parametroTipologiaPrincipal',
        attributes : ['nombre']
      }],
      order: [['createdAt', 'DESC']]
    };

    const result = await denuncia.findAll(query);
    return toJSONArray(result);
  }

  // async function listarSeguimiento (idUsuario) {
  //   const query = {
  //     include: [{
  //       model: denuncia,
  //       where      : {
  //         id: idUsuario
  //       },
  //     }]
  //   }
  //   const result = await usuarioCaso.findAll(query)
  //   return toJSONArray(result);
  // }

  async function obtenerInformacionDenuncia (idDenuncia) {
    const query = {
      attributes : ['id', 'codigoRuv', 'createdAt', 'idDistrito'],
      where      : {
        id: idDenuncia
      },
      include: [{
        model      : usuario,
        as         : 'usuario',
        required   : true,
        attributes : ['id'],
        through    : {
          where: {
            estado: 'CREADO'
          }
        }
      },
      {
        model      : parametro,
        as         : 'parametroTipologiaPrincipal',
        attributes : ['nombre', 'codigo']
      }]
    };

    const result = await denuncia.findOne(query);
    if (result) {
      return result.toJSON();
    }
    return result;
  }

  async function contarAsignados (idUsuario) {
    const query = {
      where: {
        idUsuario,
        estado: 'CREADO'
      }
    };
    const total = await usuarioCaso.count(query);
    return total;
  }

  return {
    createOrUpdate: (item, t) => Repository.createOrUpdate(item, usuarioCaso, t),
    listarAsignados,
    //listarSeguimiento,
    obtenerInformacionDenuncia,
    contarAsignados
  };
};
