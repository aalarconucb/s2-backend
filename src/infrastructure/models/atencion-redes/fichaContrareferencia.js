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
    institucion: {
      type      : DataTypes.STRING(100),
      allowNull : false,
      field     : 'institucion'
    },
    tipoAtencion: {
      type      : DataTypes.STRING(500),
      allowNull : false,
      field     : 'tipo_atencion'
    },
    breveInforme: {
      type      : DataTypes.TEXT,
      allowNull : true,
      field     : 'breve_informe'
    },
    documentosRemite: {
      type      : DataTypes.STRING(500),
      allowNull : true,
      field     : 'documentos_remite'
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

  const FichaContrareferencia = sequelize.define('ficha_contrareferencia', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'ficha_contrareferencia'
  });

  return FichaContrareferencia;
};
