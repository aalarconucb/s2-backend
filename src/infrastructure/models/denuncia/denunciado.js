'use strict';

const util = require('../../lib/util');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id                 : util.pk,
    direccionDomicilio : {
      type      : DataTypes.STRING(300),
      allowNull : true,
      field     : 'direccion_domicilio'
    },
    latitudDomicilio: {
      type      : DataTypes.STRING(20),
      allowNull : true,
      field     : 'latitud_domicilio'
    },
    longitudDomicilio: {
      type      : DataTypes.STRING(20),
      allowNull : true,
      field     : 'longitud_domicilio'
    },
    ocupacion: {
      type      : DataTypes.STRING(150),
      allowNull : true,
      field     : 'ocupacion'
    },
    institucionLaboral: {
      type      : DataTypes.STRING(150),
      allowNull : true,
      field     : 'institucion_laboral'
    },
    direccionLaboral: {
      type      : DataTypes.STRING(150),
      allowNull : true,
      field     : 'direccion_laboral'
    },
    telefonoLaboral: {
      type      : DataTypes.STRING(20),
      allowNull : true,
      field     : 'telefono_laboral'
    },
    relacionVictimaOtro: {
      type      : DataTypes.STRING(50),
      allowNull : true,
      field     : 'relacion_victima_otro'
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
      field        : 'estado'
    }
  };

  // Agregando campos para el log
  fields = util.setTimestamps(fields);

  const Denunciado = sequelize.define('denunciado', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'denunciado'
  });

  return Denunciado;
};
