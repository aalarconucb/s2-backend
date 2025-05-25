'use strict';

const util = require('../../lib/util');
const lang = require('../../lang');
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
      type      : DataTypes.STRING(250),
      allowNull : false,
      field     : 'descripcion'
    },
    rutaDocumento: {
      type      : DataTypes.STRING(150),
      allowNull : false,
      field     : 'ruta_documento'
    },
    accionSeguimiento: {
      type      : DataTypes.TEXT,
      allowNull : true,
      field     : 'accion_seguimiento'
    },
    estado: {
      type         : DataTypes.ENUM,
      values       : ['ACTIVO', 'INACTIVO'],
      defaultValue : 'ACTIVO',
      allowNull    : false,
      xlabel       : lang.t('fields.estado'),
      field        : 'estado'
    }
  };

  // Agregando campos para el log
  fields = util.setTimestamps(fields);

  const CertificadoMedico = sequelize.define('certificado_medico', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'certificado_medico'
  });

  return CertificadoMedico;
};
