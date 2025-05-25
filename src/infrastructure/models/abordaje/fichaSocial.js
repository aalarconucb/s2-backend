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
    datosFamilia: {
      type      : DataTypes.TEXT,
      allowNull : true,
      field     : 'datos_familia'
    },
    historiaSocial: {
      type      : DataTypes.TEXT,
      allowNull : true,
      field     : 'historia_social'
    },
    situacionSalud: {
      type      : DataTypes.TEXT,
      allowNull : true,
      field     : 'situacion_salud'
    },
    situacionEducativa: {
      type      : DataTypes.TEXT,
      allowNull : true,
      field     : 'situacion_educativa'
    },
    situacionEconomica: {
      type      : DataTypes.TEXT,
      allowNull : true,
      field     : 'situacion_economica'
    },
    situacionActual: {
      type      : DataTypes.TEXT,
      allowNull : false,
      field     : 'situacion_actual'
    },
    diagnosticoSocial: {
      type      : DataTypes.TEXT,
      allowNull : false,
      field     : 'diagnostico_social'
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

  const FichaSocial = sequelize.define('ficha_social', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'ficha_social'
  });

  return FichaSocial;
};
