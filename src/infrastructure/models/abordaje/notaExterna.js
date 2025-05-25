'use strict';

const util = require('../../lib/util');
const { armarFecha, formatearFecha } = require('../../lib/date');
const dayjs = require('dayjs');

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
    descripcion: {
      type      : DataTypes.STRING(250),
      allowNull : true,
      field     : 'descripcion'
    },
    rutaDocumento: {
      type      : DataTypes.STRING(150),
      allowNull : false,
      field     : 'ruta_documento'
    },
    accionSeguimiento: {
      type      : DataTypes.TEXT,
      allowNull : true, //
      field     : 'accion_seguimiento'
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

  const NotaExterna = sequelize.define('nota_externa', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'nota_externa'
  });

  return NotaExterna;
};
