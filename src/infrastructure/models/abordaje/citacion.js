'use strict';

const util = require('../../lib/util');
const { armarFecha, formatearFecha, armarFechaHora, formatearFechaHora } = require('../../lib/date');
const dayjs = require('dayjs');
const lang = require('../../lang');

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
        this.setDataValue('fecha', formatearFecha(value || dayjs().format('DD/MM/YYYY')));
      }
    },
    a: {
      type      : DataTypes.STRING(150),
      allowNull : false,
      field     : 'a'
    },
    sobre: {
      type      : DataTypes.STRING(250),
      allowNull : false,
      field     : 'sobre'
    },
    denunciaInterpuestaPor: {
      type      : DataTypes.STRING(150),
      allowNull : false,
      field     : 'denuncia_interpuesta_por'
    },
    paraDia: {
      type      : DataTypes.DATE,
      field     : 'para_dia',
      allowNull : false,
      get       : function () {
        if (this.getDataValue('paraDia')) {
          return armarFechaHora(this.getDataValue('paraDia'));
        }
        return null;
      },
      set: function (value) {
        this.setDataValue('paraDia', formatearFechaHora(value || dayjs().format('DD/MM/YYYY HH:mm')));
      }
    },
    paraHoras: {
      type      : DataTypes.STRING(15),
      allowNull : false,
      field     : 'para_horas'
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
      xlabel       : lang.t('fields.estado'),
      field        : 'estado'
    }
  };

  // Agregando campos para el log
  fields = util.setTimestamps(fields);

  const Citacion = sequelize.define('citacion', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'citacion'
  });

  return Citacion;
};
