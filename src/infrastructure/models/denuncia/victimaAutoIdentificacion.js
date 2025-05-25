'use strict';

const util = require('../../lib/util');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id        : util.pk,
    idVictima : {
      type      : DataTypes.UUID,
      allowNull : false,
      field     : 'id_victima',
      references: {
        model   : 'victima',
        key     : 'id'
      }
    },
    idAutoIdentificacion: {
      type      : DataTypes.UUID,
      allowNull : false,
      field     : 'id_auto_identificacion',
      references: {
        model   : 'sys_parametro',
        key     : 'id'
      }
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

  const VictimaAutoIdentificacion = sequelize.define('victima_auto_indetificacion', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'victima_auto_identificacion'
  });

  return VictimaAutoIdentificacion;
};
