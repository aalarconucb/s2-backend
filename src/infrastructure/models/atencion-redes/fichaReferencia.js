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
    servicio: {
      type      : DataTypes.STRING(500),
      allowNull : false,
      field     : 'servicio'
    },
    antecedentesCaso: {
      type      : DataTypes.STRING(500),
      allowNull : true,
      field     : 'antecedentes_caso'
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

  const FichaReferencia = sequelize.define('ficha_referencia', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'ficha_referencia'
  });

  return FichaReferencia;
};
