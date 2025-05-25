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
    antecedentesPersonales: {
      type      : DataTypes.TEXT,
      allowNull : true,
      field     : 'antecedentes_personales'
    },
    examenMentalFisico: {
      type      : DataTypes.TEXT,
      allowNull : true,
      field     : 'examen_mental_fisico'
    },
    examenMentalCognitivo: {
      type      : DataTypes.TEXT,
      allowNull : true,
      field     : 'examen_mental_cognitivo'
    },
    examenMentalEmocional: {
      type      : DataTypes.TEXT,
      allowNull : true,
      field     : 'examen_mental_emocional'
    },
    examenMentalConductual: {
      type      : DataTypes.TEXT,
      allowNull : true,
      field     : 'examen_mental_conductual'
    },
    tecnicasInstrumentos: {
      type      : DataTypes.TEXT,
      allowNull : false,
      field     : 'tecnicas_instrumentos'
    },
    analisisResultados: {
      type      : DataTypes.TEXT,
      allowNull : false,
      field     : 'analisis_resultados'
    },
    diagnosticoPsicologico: {
      type      : DataTypes.TEXT,
      allowNull : false,
      field     : 'diagnostico_psicologico'
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
    profesional: {
      type      : DataTypes.STRING(150),
      allowNull : true,
      field     : 'profesional',
      comment   : 'Este campo almacena el nombre del profesional relacionado con el registro.'
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

  const FichaPsicologica = sequelize.define('ficha_psicologica', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'ficha_psicologica'
  });

  return FichaPsicologica;
};
