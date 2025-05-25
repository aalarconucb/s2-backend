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
    accionRealizada: {
      type      : DataTypes.TEXT,
      allowNull : false,
      field     : 'accion_realizada'
    },
    seguimientoCognitivo: {
      type      : DataTypes.TEXT,
      allowNull : true,
      field     : 'seguimiento_cognitivo'
    },
    seguimientoAfectivo: {
      type      : DataTypes.TEXT,
      allowNull : true,
      field     : 'seguimiento_afectivo'
    },
    seguimientoConductual: {
      type      : DataTypes.TEXT,
      allowNull : true,
      field     : 'seguimiento_conductual'
    },
    estadoPsicologico: {
      type      : DataTypes.TEXT,
      allowNull : false,
      field     : 'estado_psicologico'
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

  const FichaSeguimientoPsicologico = sequelize.define('ficha_seguimiento_psicologico', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'ficha_seguimiento_psicologico'
  });

  return FichaSeguimientoPsicologico;
};
