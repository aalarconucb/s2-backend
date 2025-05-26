'use strict';

const Repository = require('../Repository');
const { toJSONArray } = require('../../lib/util');

module.exports = function fichaSeguimientoSocialRepository (models, Sequelize) {
  const { fichaSeguimientoSocial, fichaSeguimientoSocialAdjunto } = models;

  async function listar (idDenuncia) {
    const query = {
      attributes : ['id', 'fecha', 'accionSeguimiento', 'observaciones', 'rutaDocumento', 'createdAt'],
      where      : {
        idDenuncia
      }
    };

    const result = await fichaSeguimientoSocial.findAll(query);
    return toJSONArray(result);
  }

  async function findById (idInstrumento) {
    const query = {
      attributes : { exclude: ['updatedAt', 'deletedAt', 'idDenuncia', 'userCreated', 'userUpdated', 'userDeleted'], include: ['idDenuncia'] },
      where      : {
        id: idInstrumento
      },
      include: {
        model      : fichaSeguimientoSocialAdjunto,
        as         : 'adjuntoFichaSeguimientoSocial',
        attributes : ['id', 'rutaDocumento']
      }
    };

    const result = await fichaSeguimientoSocial.findOne(query);
    if (result) {
      return result.toJSON();
    }
    return null;
  }

  return {
    createOrUpdate: (item, t) => Repository.createOrUpdate(item, fichaSeguimientoSocial, t),
    findById,
    listar
  };
};
