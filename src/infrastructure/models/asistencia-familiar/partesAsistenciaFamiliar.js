'use strict';

const util = require('../../lib/util');
const lang = require('../../lang');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id                 : util.pk,
    estaEmbarazada: {
      type         : DataTypes.BOOLEAN,
      allowNull    : true,
      defaultValue : false,
      field     : 'esta_embarazada',
      comment      : 'Si la solicitante esta embarazada',
    },
    tipoParte: {
      type: DataTypes.ENUM('SOLICITANTE', 'DEMANDADO'),
      allowNull: false,
      field     : 'tipo_parte',
      comment: 'Indica si la persona es un Solicitante o un Demandado|Obligado',
    },
    rutaDocumento: {
      type      : DataTypes.STRING(250),
      allowNull : true,
      field     : 'ruta_documento'
    },
    observaciones: {
      type      : DataTypes.TEXT,
      allowNull : true,
      field     : 'observaciones'
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

  const PartesAsistenciaFamiliar = sequelize.define('partes_asistencia_familiar', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'partes_asistencia_familiar'
  });

  return PartesAsistenciaFamiliar;
};
