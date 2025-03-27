'use strict';

const lang = require('../../lang');
const util = require('../../lib/util');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id    : util.pk,
    idRol : {
      type      : DataTypes.UUID,
      allowNull : true,
      xlabel    : lang.t('fields.idRol'),
      field     : 'id_rol'
    },
    idPermiso: {
      type      : DataTypes.UUID,
      allowNull : false,
      xlabel    : lang.t('fields.idPermiso'),
      field     : 'id_permiso'
    }
  };

  // Agregando campos para el log
  fields = util.setTimestamps(fields);

  const RolPermiso = sequelize.define('rol_permiso', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'sys_rol_permiso'
  });

  return RolPermiso;
};
