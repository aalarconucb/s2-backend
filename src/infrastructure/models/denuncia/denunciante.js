'use strict';

const util = require('../../lib/util');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id                         : util.pk,
    tipoDenuncianteDescripcion : {
      type      : DataTypes.STRING(150),
      allowNull : true,
      field     : 'tipo_denunciante_descripcion'
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

  const Denunciante = sequelize.define('denunciante', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'denunciante'
  });

  return Denunciante;
};
