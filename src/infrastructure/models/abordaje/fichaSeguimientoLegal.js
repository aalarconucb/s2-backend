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
      type      : DataTypes.STRING(150),
      allowNull : true,
      field     : 'institucion'
    },
    verificacionRealizada: {
      type      : DataTypes.TEXT,
      allowNull : true,
      field     : 'verificacion_realizada'
    },
    resultadosObtenidos: {
      type      : DataTypes.TEXT,
      allowNull : false,
      field     : 'resultados_obtenidos'
    },
    siguienteActuado: {
      type      : DataTypes.TEXT,
      allowNull : false,
      field     : 'siguiente_actuado'
    },
    accionSeguimiento: {
      type      : DataTypes.TEXT,
      allowNull : true, //este campo ya no estara disponible
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
    profesional: {
      type      : DataTypes.STRING(150),
      allowNull : true,
      field     : 'profesional'
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

  const FichaSeguimientoLegal = sequelize.define('ficha_seguimiento_legal', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'ficha_seguimiento_legal'
  });

  return FichaSeguimientoLegal;
};
