'use strict';

const util = require('../../lib/util');
const { armarFecha, formatearFecha } = require('../../lib/date');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id        : util.pk,
    codigoRuv : {
      type  : DataTypes.STRING(35),
      field : 'codigo_ruv'
    },
    secuencial: {
      type  : DataTypes.STRING(7),
      field : 'secuencial'
    },
    relacionHecho: {
      type      : DataTypes.TEXT,
      allowNull : false,
      field     : 'relacion_hecho'
    },
    direccionHecho: {
      type  : DataTypes.TEXT,
      field : 'direccion_hecho'
    },
    fechaHecho: {
      type      : DataTypes.DATEONLY,
      field     : 'fecha_hecho',
      allowNull : true,
      get       : function () {
        if (this.getDataValue('fechaHecho')) {
          return armarFecha(this.getDataValue('fechaHecho'));
        }
        return null;
      },
      set: function (value) {
        this.setDataValue('fechaHecho', formatearFecha(value));
      }
    },
    horaHecho: {
      type      : DataTypes.STRING(10),
      allowNull : true,
      field     : 'hora_hecho'
    },
    estado: {
      type         : DataTypes.ENUM,
      values       : ['REGISTRADO', 'ASIGNADO', 'FINALIZADO', 'SENTENCIA', 'PRESCRIPCION', 'RECHAZO', 'ACTOS_CONCLUSIVOS', 'CAMBIO_PATROCINIO_LEGAL', 'INACTIVO'],
      defaultValue : 'REGISTRADO',
      allowNull    : false,
      field        : 'estado'
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
    }
  };

  // Agregando campos para el log
  fields = util.setTimestamps(fields);

  const Denuncia = sequelize.define('denuncia', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'denuncia'
  });

  return Denuncia;
};
