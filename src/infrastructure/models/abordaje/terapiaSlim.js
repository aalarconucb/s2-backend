'use strict';

const util = require('../../lib/util');
const { armarFecha, formatearFecha, formatearFechaHora, armarFechaHora } = require('../../lib/date');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id    : util.pk,
    fecha : {
      type      : DataTypes.DATE,
      field     : 'fecha',
      allowNull : false,
      get       : function () {
        if (this.getDataValue('fecha')) {
          return armarFechaHora(this.getDataValue('fecha'));
        }
        return null;
      },
      set: function (value) {
        this.setDataValue('fecha', formatearFechaHora(value));
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
    abordajeTerapeutico: {
      type      : DataTypes.TEXT,
      allowNull : false,
      field     : 'abordaje_terapeutico'
    },
    prescripcionesTerapeuticas: {
      type      : DataTypes.TEXT,
      allowNull : true,
      field     : 'prescripciones_terapeuticas'
    },
    numeroSesion: {
      type      : DataTypes.INTEGER,
      allowNull : false,
      field     : 'numeroSesion'
    },
    horaProximaSesion: {
      type      : DataTypes.STRING(10),
      allowNull : true,
      field     : 'hora_proxima_sesion'
    },
    accionSeguimiento: {
      type      : DataTypes.TEXT,
      allowNull : true, //
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

  const TerapiaSlim = sequelize.define('terapia_slim', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'terapia_slim'
  });

  return TerapiaSlim;
};
