'use strict';

const util = require('../../lib/util');
const lang = require('../../lang');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id      : util.pk,
    estudia : {
      type         : DataTypes.BOOLEAN,
      allowNull    : true,
      defaultValue : false,
      field        : 'estudia'
    },
    relacionParentescoOtro: {
      type      : DataTypes.STRING(50),
      allowNull : true,
      field     : 'relacion_parentesco_otro'
    },
    rutaDocumento: {
      type      : DataTypes.STRING(250),
      allowNull : true,
      field     : 'ruta_documento'
    },
    observaciones: {
      type      : DataTypes.TEXT,
      allowNull : true,
      field     : 'observaciones'
    },
    estado: {
      type         : DataTypes.ENUM,
      values       : ['ACTIVO', 'INACTIVO'],
      defaultValue : 'ACTIVO',
      allowNull    : false,
      xlabel       : lang.t('fields.estado'),
      field        : 'estado'
    }
  };
  // Agregando campos para el log
  fields = util.setTimestamps(fields);

  const Dependiente = sequelize.define('dependiente', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'dependiente'
  });

  return Dependiente;
};
