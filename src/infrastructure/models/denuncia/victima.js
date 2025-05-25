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
      allowNull : false,
      field     : 'latitud_domicilio'
    },
    longitudDomicilio: {
      type      : DataTypes.STRING(20),
      allowNull : false,
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
    embarazo: {
      type         : DataTypes.BOOLEAN,
      allowNull    : false,
      defaultValue : false
    },
    telefonoLaboral: {
      type      : DataTypes.STRING(20),
      allowNull : true,
      field     : 'telefono_laboral'
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

  const Victima = sequelize.define('victima', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'victima'
  });

  return Victima;
};
