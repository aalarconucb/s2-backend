'use strict';

const lang = require('../../lang');
const util = require('../../lib/util');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id           : util.pk,
    idAplicacion : {
      type      : DataTypes.UUID,
      allowNull : true,
      xlabel    : lang.t('fields.idAplicacion'),
      field     : 'idAplicacion'
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

  const RolPermiso = sequelize.define('aplicacion_permiso', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'sys_aplicacion_permiso'
  });

  return RolPermiso;
};
