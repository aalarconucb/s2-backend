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
      allowNull : true,
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
    nroCaso: {
      type      : DataTypes.STRING(100),
      allowNull : true,
      field     : 'nro_caso'
    },
    nroOrientacion: {
      type      : DataTypes.STRING(100),
      allowNull : true,
      field     : 'nro_orientacion'
    },
    lugar: {
      type      : DataTypes.STRING(200),
      allowNull : true,
      field     : 'lugar'
    },
    peticionario: {
      type      : DataTypes.STRING(100),
      allowNull : false,
      field     : 'peticionario'
    },
    numeroDocumentoPeticionario: {
      type      : DataTypes.STRING(100),
      // allowNull : false,
      field     : 'numero_documento_peticionario'
    },
    relacionHecho: {
      type      : DataTypes.TEXT,
      allowNull : false,
      field     : 'relacion_hecho'
    },
    peticion: {
      type      : DataTypes.TEXT,
      allowNull : false,
      field     : 'peticion'
    },
    orientacionRecomendacionTecnica: {
      type      : DataTypes.TEXT,
      allowNull : false,
      field     : 'orientacion_recomendacion_tecnica'
    },
    fechaOrientacion: {
      type      : DataTypes.DATEONLY,
      field     : 'fecha_orientacion',
      allowNull : true,
      get       : function () {
        if (this.getDataValue('fechaOrientacion')) {
          return armarFecha(this.getDataValue('fechaOrientacion'));
        }
        return null;
      },
      set: function (value) {
        this.setDataValue('fechaOrientacion', formatearFecha(value || dayjs().format('DD/MM/YYYY')));
      }
    },
    secuencial: {
      type  : DataTypes.STRING(7),
      allowNull : true,
      field : 'secuencial'
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

  const Orientacion = sequelize.define('orientacion', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'orientacion'
  });

  return Orientacion;
};
