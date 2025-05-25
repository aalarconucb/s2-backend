'use strict';

const lang = require('../../lang');
const util = require('../../lib/util');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id     : util.pk,
    nombre : {
      type      : DataTypes.STRING(400),
      allowNull : false,
      xlabel    : lang.t('fields.nombre')
    },
    direccion: {
      type   : DataTypes.TEXT,
      xlabel : lang.t('fields.direccion'),
      field  : 'direccion'
    },
    telefono: {
      type   : DataTypes.STRING(15),
      xlabel : lang.t('fields.telefono'),
      field  : 'telefono'
    },
    rutaLogo: {
      type      : DataTypes.STRING(150),
      allowNull : true,
      field     : 'ruta_logo'
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

  const Municipio = sequelize.define('municipio', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'municipio'
  });

  return Municipio;
};
