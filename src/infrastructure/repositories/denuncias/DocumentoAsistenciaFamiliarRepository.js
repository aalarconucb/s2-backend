'use strict';

const Repository = require('../Repository');
const { toJSONArray } = require('../../lib/util');

module.exports = function documentoAsistenciaFamiliarRepository (models, Sequelize) {
  const { documentoAsistenciaFamiliar, documentoAsistenciaFamiliarAdjunto } = models;
  const attributes = {
    exclude: ['updatedAt', 'deletedAt', 'userCreated', 'userUpdated', 'userDeleted', 'idDenuncia']
  };

  async function listar (idDenuncia) {
    const query = {
      attributes : ['id', 'fecha', 'accionSeguimiento', 'observaciones', 'rutaDocumento', 'createdAt'],
      where      : {
        idDenuncia
      }
    };

    const result = await documentoAsistenciaFamiliar.findAll(query);
    return toJSONArray(result);
  }

  async function findById (idInstrumento) {
    const query = {
      attributes : { exclude: ['updatedAt', 'deletedAt', 'idDenuncia', 'userCreated', 'userUpdated', 'userDeleted'] },
      where      : {
        id: idInstrumento
      },
      include: {
        model      : documentoAsistenciaFamiliarAdjunto,
        as         : 'adjuntoDocumentoAsistenciaFamiliar',
        attributes : ['id', 'rutaDocumento']
      }
    };

    const result = await documentoAsistenciaFamiliar.findOne(query);
    if (result) {
      return result.toJSON();
    }
    return null;
  }

  return {
    createOrUpdate: (item, t) => Repository.createOrUpdate(item, documentoAsistenciaFamiliar, t),
    findById,
    listar
  };
};
