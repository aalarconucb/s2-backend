'use strict';

const Repository = require('../Repository');
const { toJSONArray } = require('../../lib/util');

module.exports = function fichaSocialRepository (models, Sequelize) {
  const { fichaSocial, fichaSocialAdjunto } = models;

  async function listar (idDenuncia) {
    const query = {
      attributes : ['id', 'fecha', 'accionSeguimiento', 'observaciones', 'rutaDocumento', 'createdAt'],
      where      : {
        idDenuncia
      }
    };

    const result = await fichaSocial.findAll(query);
    return toJSONArray(result);
  }

  async function findById (idInstrumento) {
    const query = {
      attributes : { exclude: ['updatedAt', 'deletedAt', 'idDenuncia', 'userCreated', 'userUpdated', 'userDeleted'], include: ['idDenuncia'] },
      where      : {
        id: idInstrumento
      },
      include: {
        model      : fichaSocialAdjunto,
        as         : 'adjuntoFichaSocial',
        attributes : ['id', 'rutaDocumento']
      }
    };

    const result = await fichaSocial.findOne(query);
    if (result) {
      return result.toJSON();
    }
    return null;
  }

  return {
    createOrUpdate: (item, t) => Repository.createOrUpdate(item, fichaSocial, t),
    findById,
    listar
  };
};
