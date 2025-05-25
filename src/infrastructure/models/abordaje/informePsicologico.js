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
    motivoEvaluacion: {
      type      : DataTypes.TEXT,
      allowNull : true,
      field     : 'motivo_evaluacion'
    },
    tecnicasUtilizadas: {
      type      : DataTypes.TEXT,
      allowNull : true,
      field     : 'tecnicas_utilizadas'
    },
    resultadosAnalisis: {
      type      : DataTypes.TEXT,
      allowNull : true,
      field     : 'resultados_analisis'
    },
    impresionDiagnostivaCognitivo: {
      type      : DataTypes.TEXT,
      allowNull : true,
      field     : 'impresion_diagnostica_cognitivo'
    },
    impresionDiagnosticaAfectivo: { //
      type      : DataTypes.TEXT,
      allowNull : true,
      field     : 'impresion_diagnostica_afectivo'
    },
    impresionDiagnosticaComportamental: {
      type      : DataTypes.TEXT,
      allowNull : true,
      field     : 'impresion_diagnostica_comportamental'
    },
    impresionDiagnosticaRelacional: {
      type      : DataTypes.TEXT,
      allowNull : true,
      field     : 'impresion_diagnostica_relacional'
    },
    impresionDiagnosticaFamiliar: {
      type      : DataTypes.TEXT,
      allowNull : true,
      field     : 'impresion_diagnostica_familiar'
    },
    antecedentesClinicos: {
      type      : DataTypes.TEXT,
      allowNull : true,
      field     : 'antecedentes_clinicos'
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

  const InformePsicologico = sequelize.define('informe_psicologico', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'informe_psicologico'
  });

  return InformePsicologico;
};
