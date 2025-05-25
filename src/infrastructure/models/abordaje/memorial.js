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
    dirigidoA: {
      type      : DataTypes.STRING(100),
      allowNull : true,
      field     : 'dirigido_a'
    },
    requerimiento: {
      type      : DataTypes.STRING(100),
      allowNull : true,
      field     : 'requerimiento'
    },
    cud: {
      type      : DataTypes.STRING(100),
      allowNull : true,
      field     : 'cud'
    },
    nurej: {
      type      : DataTypes.STRING(100),
      allowNull : true,
      field     : 'nurej'
    },
    relacionHechos: {
      type      : DataTypes.TEXT,
      allowNull : true,
      field     : 'relacion_hechos'
    },
    fundamentoDerecho: {
      type      : DataTypes.TEXT,
      allowNull : true,
      field     : 'fundamento_derecho'
    },
    petitorio: {
      type      : DataTypes.TEXT,
      allowNull : true,
      field     : 'petitorio'
    },
    otros1: {
      type      : DataTypes.TEXT,
      allowNull : true,
      field     : 'otros_1'
    },
    otros2: {
      type      : DataTypes.TEXT,
      allowNull : true,
      field     : 'otros_2'
    },
    otros3: {
      type      : DataTypes.TEXT,
      allowNull : true,
      field     : 'otros_3'
    },
    otros4: {
      type      : DataTypes.TEXT,
      allowNull : true,
      field     : 'otros_4'
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

  const Memorial = sequelize.define('memorial', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'memorial'
  });

  return Memorial;
};
