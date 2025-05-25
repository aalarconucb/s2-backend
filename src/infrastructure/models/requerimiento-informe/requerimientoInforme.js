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
      type      : DataTypes.STRING(500),
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
    secuencial: {
      type  : DataTypes.STRING(7),
      allowNull : true,
      field : 'secuencial'
    },
    tipo: {
      type         : DataTypes.ENUM,
      values       : ['FISCAL', 'JUDICIAL', 'OTRO'],
      defaultValue : 'FISCAL',
      allowNull    : false,
      field        : 'tipo'
    },
    entidadSolicitante: {
      type      : DataTypes.STRING(300),
      allowNull : true,
      field     : 'entidad_solicitante'
    },
    autoridadSolicitante: {
      type      : DataTypes.STRING(300),
      allowNull : true,
      field     : 'autoridad_solicitante'
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

  const RequerimientoInforme = sequelize.define('requerimiento_informe', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'requerimiento_informe'
  });

  return RequerimientoInforme;
};
