'use strict';

const util = require('../../lib/util');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id        : util.pk,
    idVictima : {
      type      : DataTypes.UUID,
      allowNull : false,
      field     : 'id_victima'
    },
    idPoblacionVulnerable: {
      type      : DataTypes.UUID,
      allowNull : false,
      field     : 'id_poblacion_vulnerable'
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

  const VictimaPoblacionVulnerable = sequelize.define('victima_poblacion_vulnerable', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'victima_poblacion_vulnerable'
  });

  return VictimaPoblacionVulnerable;
};
