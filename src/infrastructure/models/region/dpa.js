'use strict';

const lang = require('../../lang');
const util = require('../../lib/util');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    codigo: {
      primaryKey : true,
      type       : DataTypes.STRING(6),
      field      : 'codigo'
    },
    municipio: {
      type      : DataTypes.STRING(100),
      allowNull : true,
      field     : 'municipio'
    },
    codigoProvincia: {
      type      : DataTypes.STRING(4),
      allowNull : false,
      field     : 'codigo_provincia'
    },
    provincia: {
      type      : DataTypes.STRING(50),
      allowNull : true,
      field     : 'provincia'
    },
    codigoDepartamento: {
      type      : DataTypes.STRING(2),
      allowNull : false,
      field     : 'codigo_departamento'
    },
    departamento: {
      type      : DataTypes.STRING(50),
      allowNull : false,
      field     : 'departamento'
    },
    latitud: {
      type      : DataTypes.STRING(15),
      allowNull : false,
      field     : 'latitud'
    },
    longitud: {
      type      : DataTypes.STRING(15),
      allowNull : false,
      field     : 'longitud'
    },
    red: {
      type      : DataTypes.STRING(15),
      allowNull : true,
      field     : 'red'
    },
    sigla: {
      type      : DataTypes.STRING(15),
      allowNull : true,
      field     : 'sigla'
    },
    estado: {
      type         : DataTypes.ENUM,
      values       : ['ACTIVO', 'INACTIVO'],
      allowNull    : false,
      defaultValue : 'ACTIVO',
      xlabel       : lang.t('fields.estado'),
      field        : 'estado'
    },
    codigoMefp: {
      type        : DataTypes.STRING(6),
      allowNull   : true,
      field       : 'codigo_mefp'
    },
  };

  // Agregando campos para el log
  fields = util.setTimestamps(fields);

  const Dpa = sequelize.define('dpa', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'sys_dpa'
  });

  return Dpa;
};
