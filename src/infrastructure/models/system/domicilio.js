'use strict';

const util = require('../../lib/util');
const lang = require('../../lang')

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id              : util.pk,
    tipoDomicilio: {
      type         : DataTypes.ENUM,
      values       : ['REAL', 'LABORAL'],
      defaultValue : 'REAL',
      allowNull    : false,
      xlabel       : lang.t('fields.tipoDomicilio'),
      field        : 'tipo_domicilio',
      comment      : 'Tipo de Domicilio REAL o LABORAL',
    },
    direccion: {
      type      : DataTypes.STRING(250),
      allowNull : true,
      xlabel    : lang.t('fields.direccion'),
      field     : 'direccion'
    },
    telefono: {
      type      : DataTypes.STRING(30),
      allowNull : true,
      field     : 'telefono'
    },
    latitud: {
      type      : DataTypes.STRING(20),
      allowNull : true,
      field     : 'latitud'
    },
    longitud: {
      type      : DataTypes.STRING(20),
      allowNull : true,
      field     : 'longitud'
    },
    institucionLaboral: {
      type      : DataTypes.STRING(250),
      allowNull : true,
      xlabel    : lang.t('fields.institucionLaboral'),
      field     : 'institucion_laboral',
      comment   : 'Nombre de la Institución donde trabajaba, si el domicilio es real este valor es null',
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

  const Domicilio = sequelize.define('domicilio', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'domicilio'
  });

  return Domicilio;
};
