'use strict';

const util = require('../../lib/util');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id            : util.pk,
    rutaDocumento : {
      type      : DataTypes.STRING(150),
      allowNull : true,
      field     : 'ruta_documento'
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

  const FichaSeguimientoSocialAdjunto = sequelize.define('ficha_seguimiento_social_adjunto', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'ficha_seguimiento_social_adjunto'
  });

  return FichaSeguimientoSocialAdjunto;
};
