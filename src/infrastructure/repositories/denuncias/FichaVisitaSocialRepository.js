'use strict';

const Repository = require('../Repository');
const { toJSONArray } = require('../../lib/util');

module.exports = function fichaVisitaSocialRepository (models, Sequelize) {
  const { fichaVisitaSocial, fichaVisitaSocialAdjunto } = models;

  async function listar (idDenuncia) {
    const query = {
      attributes : ['id', 'fecha', 'accionSeguimiento', 'observaciones', 'rutaDocumento', 'createdAt'],
      where      : {
        idDenuncia
      }
    };

    const result = await fichaVisitaSocial.findAll(query);
    return toJSONArray(result);
  }

  async function findById (idInstrumento) {
    const query = {
      attributes : { exclude: ['updatedAt', 'deletedAt', 'idDenuncia', 'userCreated', 'userUpdated', 'userDeleted'], include: ['idDenuncia'] },
      where      : {
        id: idInstrumento
      },
      include: {
        model      : fichaVisitaSocialAdjunto,
        as         : 'adjuntoFichaVisitaSocial',
        attributes : ['id', 'rutaDocumento']
      }
    };

    const result = await fichaVisitaSocial.findOne(query);
    if (result) {
      return result.toJSON();
    }
    return null;
  }

  return {
    createOrUpdate: (item, t) => Repository.createOrUpdate(item, fichaVisitaSocial, t),
    findById,
    listar
  };
};
