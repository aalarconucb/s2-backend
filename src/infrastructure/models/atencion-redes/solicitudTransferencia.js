'use strict';

const util = require('../../lib/util');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id     : util.pk,
    motivo : {
      type      : DataTypes.TEXT,
      allowNull : false,
      field     : 'motivo'
    },
    idDistritoOrigen: {
      type      : DataTypes.STRING(50),
      allowNull : false,
      field     : 'id_distrito_origen'
    },
    idDistritoDestino: {
      type      : DataTypes.STRING(50),
      allowNull : false,
      field     : 'id_distrito_destino'
    },
    estado: {
      type         : DataTypes.ENUM,
      values       : ['ACTIVO', 'INACTIVO', 'ATENDIDA', 'RECHAZADA'],
      defaultValue : 'ACTIVO',
      allowNull    : false,
      field        : 'estado'
    }
  };

  // Agregando campos para el log
  fields = util.setTimestamps(fields);

  const SolicitudTransferencia = sequelize.define('solicitud_transferencia', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'solicitud_transferencia'
  });

  return SolicitudTransferencia;
};
