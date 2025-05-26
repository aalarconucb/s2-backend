'use strict';

const Repository = require('../Repository');
const { toJSONArray } = require('../../lib/util');

module.exports = function terapiaSlimRepository (models, Sequelize) {
  const { interrupcionLegalEmbarazo } = models;
  const attributes = { exclude: ['updatedAt', 'deletedAt', 'idDenuncia', 'userCreated', 'userUpdated', 'userDeleted'] };

  async function listar (idDenuncia) {
    const query = {
      attributes : ['id', 'fechaConsentimiento', 'fechaIle', 'fechaDenunciaExterna', 'createdAt', 'horaDenunciaExterna', 'consentimientoInformado', 'hospital', 'observacionesProcedimiento', 'situacionPosterior', 'codigoMunicipio'],
      where      : {
        idDenuncia
      }
    };

    const result = await interrupcionLegalEmbarazo.findAll(query);
    return toJSONArray(result);
  }

  return {
    createOrUpdate : (item, t) => Repository.createOrUpdate(item, interrupcionLegalEmbarazo, t),
    findById       : id => Repository.findById(id, interrupcionLegalEmbarazo, attributes),
    listar
  };
};
