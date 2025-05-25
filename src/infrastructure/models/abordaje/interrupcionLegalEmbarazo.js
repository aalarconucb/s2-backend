'use strict';

const util = require('../../lib/util');
const { armarFecha, formatearFecha } = require('../../lib/date');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id                   : util.pk,
    fechaDenunciaExterna : {
      type      : DataTypes.DATEONLY,
      field     : 'fecha_denuncia_externa',
      allowNull : false,
      get       : function () {
        if (this.getDataValue('fechaDenunciaExterna')) {
          return armarFecha(this.getDataValue('fechaDenunciaExterna'));
        }
        return null;
      },
      set: function (value) {
        this.setDataValue('fechaDenunciaExterna', formatearFecha(value));
      }
    },
    horaDenunciaExterna: {
      type      : DataTypes.STRING(10),
      allowNull : true,
      field     : 'hora_denuncia_externa'
    },
    consentimientoInformado: {
      type         : DataTypes.BOOLEAN,
      allowNull    : false,
      defaultValue : false,
      field        : 'consentimiento_informado'
    },
    fechaConsentimiento: {
      type      : DataTypes.DATEONLY,
      field     : 'fecha_consentimiento',
      allowNull : false,
      get       : function () {
        if (this.getDataValue('fechaConsentimiento')) {
          return armarFecha(this.getDataValue('fechaConsentimiento'));
        }
        return null;
      },
      set: function (value) {
        this.setDataValue('fechaConsentimiento', formatearFecha(value));
      }
    },
    hospital: {
      type      : DataTypes.STRING(100),
      allowNull : false,
      field     : 'hospital'
    },
    fechaIle: {
      type      : DataTypes.DATEONLY,
      field     : 'fecha_ile',
      allowNull : false,
      get       : function () {
        if (this.getDataValue('fechaIle')) {
          return armarFecha(this.getDataValue('fechaIle'));
        }
        return null;
      },
      set: function (value) {
        this.setDataValue('fechaIle', formatearFecha(value));
      }
    },
    observacionesProcedimiento: {
      type      : DataTypes.STRING(500),
      allowNull : true,
      field     : 'observaciones_procedimiento'
    },
    situacionPosterior: {
      type      : DataTypes.STRING(500),
      allowNull : false,
      field     : 'situacion_posterior'
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

  const InterrupcionLegalEmbarazo = sequelize.define('interrupcion_legal_embarazo', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'interrupcion_legal_embarazo'
  });

  return InterrupcionLegalEmbarazo;
};
