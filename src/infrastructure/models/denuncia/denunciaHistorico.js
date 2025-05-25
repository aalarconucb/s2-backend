'use strict';

const util = require('../../lib/util');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id                 : util.pk,
    motivoModificacion : {
      type      : DataTypes.TEXT,
      allowNull : false,
      field     : 'motivo_modificacion'
    }
  };

  // Agregando campos para el log
  fields = util.setTimestamps(fields);

  const DenunciaHistorico = sequelize.define('denuncia_historico', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'denuncia_historico'
  });

  return DenunciaHistorico;
};
