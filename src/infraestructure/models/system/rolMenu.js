'use strict';

const lang = require('../../lang');
const util = require('../../lib/util');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id    : util.pk,
    idRol : {
      type      : DataTypes.UUID,
      allowNull : false,
      xlabel    : lang.t('fields.idRol'),
      field     : 'id_rol'
    },
    idMenu: {
      type      : DataTypes.UUID,
      allowNull : false,
      xlabel    : lang.t('fields.idMenu'),
      field     : 'id_menu'
    }
  };

  // Agregando campos para el log
  fields = util.setTimestamps(fields);

  const RolMenu = sequelize.define('rol_menu', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'sys_rol_menu'
  });

  return RolMenu;
};
