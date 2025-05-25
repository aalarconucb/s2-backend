'use strict';

const util = require('../../lib/util');
const { armarFecha, formatearFecha } = require('../../lib/date');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id      : util.pk,
    nroCite : {
      type      : DataTypes.STRING(300),
      allowNull : false,
      field     : 'nro_cite'
    },
    a: {
      type      : DataTypes.STRING(150),
      allowNull : false,
      field     : 'a'
    },
    cargoA: {
      type      : DataTypes.STRING(150),
      allowNull : false,
      field     : 'cargo_a'
    },
    institucionA: {
      type      : DataTypes.STRING(150),
      allowNull : false,
      field     : 'institucion_a'
    },
    via: {
      type      : DataTypes.STRING(150),
      allowNull : true,
      field     : 'via'
    },
    cargoVia: {
      type      : DataTypes.STRING(150),
      allowNull : true,
      field     : 'cargo_via'
    },
    institucionVia: {
      type      : DataTypes.STRING(150),
      allowNull : true,
      field     : 'institucion_via'
    },
    de: {
      type      : DataTypes.STRING(150),
      allowNull : false,
      field     : 'de'
    },
    cargoDe: {
      type      : DataTypes.STRING(150),
      allowNull : false,
      field     : 'cargo_de'
    },
    institucionDe: {
      type      : DataTypes.STRING(150),
      allowNull : false,
      field     : 'institucion_de'
    },
    referencia: {
      type      : DataTypes.STRING(150),
      allowNull : false,
      field     : 'referencia'
    },
    fecha: {
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
    antecedentesRelevanciaJuridica: {
      type      : DataTypes.TEXT,
      allowNull : true,
      field     : 'antecedentes_relevancia_juridica'
    },
    marcoNormativo: {
      type      : DataTypes.TEXT,
      allowNull : true,
      field     : 'marco_normativo'
    },
    analisisJuridico: {
      type      : DataTypes.TEXT,
      allowNull : true,
      field     : 'analisis_juridico'
    },
    conclusiones: {
      type      : DataTypes.TEXT,
      allowNull : false,
      field     : 'conclusiones'
    },
    recomendaciones: {
      type      : DataTypes.TEXT,
      allowNull : false,
      field     : 'recomendaciones'
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

  const InformeLegal = sequelize.define('informe_legal', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'informe_legal'
  });

  return InformeLegal;
};
