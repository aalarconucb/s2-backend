'use strict';

const util = require('../../lib/util');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id            : util.pk,
    observaciones : {
      type  : DataTypes.TEXT,
      field : 'observaciones'
    },
    profesional: {
      type      : DataTypes.STRING(25),
      allowNull : false,
      field     : 'profesional'
    },
    respuesta: {
      type      : DataTypes.TEXT,
      allowNull : false,
      field     : 'respuesta'
    },
    usuarioId: {
      type      : DataTypes.STRING(60),
      allowNull : false,
      field     : 'usuario_id'
    },
    estado: {
      type         : DataTypes.ENUM,
      values       : ['CREADO', 'ATENDIDA', 'RECHAZADA', 'INACTIVO'],
      defaultValue : 'CREADO',
      allowNull    : false,
      field        : 'estado'
    }
  };

  // Agregando campos para el log
  fields = util.setTimestamps(fields);

  const SolicitudAtencion = sequelize.define('solicitud_atencion', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'solicitud_atencion'
  });

  return SolicitudAtencion;
};
