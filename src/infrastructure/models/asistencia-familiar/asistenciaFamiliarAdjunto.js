'use strict';

const util = require('../../lib/util');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id            : util.pk,
    rutaDocumento : {
      type      : DataTypes.STRING(200),
      allowNull : true,
      field     : 'ruta_documento'
    },
    perteneceA: {
      type         : DataTypes.ENUM,
      values       : ['SOLICITANTE', 'DEMANDADO', 'DEPENDIENTE', 'ASISTENCIA'],
      defaultValue : 'ASISTENCIA',
      allowNull    : false,
      field        : 'pertenece_a'
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

  const AsistenciaFamiliarAdjunto = sequelize.define('asistencia_familiar_adjunto', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'asistencia_familiar_adjunto'
  });

  return AsistenciaFamiliarAdjunto;
};
