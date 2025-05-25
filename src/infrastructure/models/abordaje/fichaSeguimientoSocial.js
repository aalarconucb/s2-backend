'use strict';

const util = require('../../lib/util');
const { armarFecha, formatearFecha } = require('../../lib/date');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id    : util.pk,
    fecha : {
      type      : DataTypes.DATEONLY,
      field     : 'fecha',
      allowNull : false,
      get       : function () {
        if (this.getDataValue('fecha')) {
          return armarFecha(this.getDataValue('fecha'));
        }
        return null;
      },
      set: function (value) {
        this.setDataValue('fecha', formatearFecha(value));
      }
    },
    situacionActual: {
      type      : DataTypes.TEXT,
      allowNull : true,
      field     : 'situacion_actual'
    },
    motivoSeguimiento: {
      type      : DataTypes.TEXT,
      allowNull : false,
      field     : 'motivo_seguimiento'
    },
    descripcionSeguimiento: {
      type      : DataTypes.TEXT,
      allowNull : false,
      field     : 'descripcion_seguimiento'
    },
    resultados: {
      type      : DataTypes.TEXT,
      allowNull : false,
      field     : 'resultados'
    },
    accionSeguimiento: {
      type      : DataTypes.TEXT,
      allowNull : true, //
      field     : 'accion_seguimiento'
    },
    observaciones: {
      type      : DataTypes.TEXT,
      allowNull : true,
      field     : 'observaciones'
    },
    rutaDocumento: {
      type      : DataTypes.STRING(150),
      allowNull : true,
      field     : 'ruta_documento'
    },
    profesional: {
      type      : DataTypes.STRING(150),
      allowNull : true,
      field     : 'profesional',
      comment   : 'Este campo almacena el nombre del profesional relacionado con el registro.'
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

  const FichaSeguimientoSocial = sequelize.define('ficha_seguimiento_social', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'ficha_seguimiento_social'
  });

  return FichaSeguimientoSocial;
};
