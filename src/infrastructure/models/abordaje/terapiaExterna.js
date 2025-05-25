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
    fechaProximaSesion: {
      type      : DataTypes.DATEONLY,
      field     : 'fecha_proxima_sesion',
      allowNull : true,
      get       : function () {
        if (this.getDataValue('fechaProximaSesion')) {
          return armarFecha(this.getDataValue('fechaProximaSesion'));
        }
        return null;
      },
      set: function (value) {
        if (value) {
          this.setDataValue('fechaProximaSesion', formatearFecha(value));
        }
      }
    },
    ultimaSesion: {
      type         : DataTypes.BOOLEAN,
      allowNull    : true,
      defaultValue : false,
      field        : 'ultima_sesion'
    },
    nombreTerapeuta: {
      type      : DataTypes.STRING(100),
      allowNull : false,
      field     : 'nombre_terapeuta'
    },
    institucion: {
      type      : DataTypes.STRING(100),
      allowNull : false,
      field     : 'institucion'
    },
    horaProximaSesion: {
      type      : DataTypes.STRING(10),
      allowNull : true,
      field     : 'hora_proxima_sesion'
    },
    rutaDocumento: {
      type      : DataTypes.STRING(150),
      allowNull : false,
      field     : 'ruta_documento'
    },
    accionSeguimiento: {
      type      : DataTypes.TEXT,
      allowNull : true,//
      field     : 'accion_seguimiento'
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

  const TerapiaExterna = sequelize.define('terapia_externa', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'terapia_externa'
  });

  return TerapiaExterna;
};
