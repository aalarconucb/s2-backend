'use strict';

const lang = require('../../lang');
const util = require('../../lib/util');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id        : util.pk,
    idUsuario : {
      type      : DataTypes.UUID,
      allowNull : false,
      xlabel    : lang.t('fields.idUsuario'),
      field     : 'id_usuario'
    },
    idRol: {
      type      : DataTypes.UUID,
      allowNull : false,
      xlabel    : lang.t('fields.idRol'),
      field     : 'id_rol'
    }
  };

  // Agregando campos para el log
  fields = util.setTimestamps(fields);

  const RolUsuario = sequelize.define('rol_usuario', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'sys_rol_usuario'
  });

  return RolUsuario;
};
