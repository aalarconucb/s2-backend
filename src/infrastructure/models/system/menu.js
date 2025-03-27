'use strict';

const lang = require('../../lang');
const util = require('../../lib/util');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id     : util.pk,
    nombre : {
      type   : DataTypes.STRING(50),
      xlabel : lang.t('fields.nombre'),
      field  : 'nombre'
    },
    ruta: {
      type   : DataTypes.STRING(200),
      xlabel : lang.t('fields.ruta')
    },
    icono: {
      type   : DataTypes.TEXT,
      xlabel : lang.t('fields.icono'),
      field  : 'icono'
    },
    idMenu: {
      type      : DataTypes.UUID,
      allowNull : true,
      xlabel    : lang.t('fields.idMenu'),
      field     : 'id_menu'
    },
    orden: {
      type         : DataTypes.INTEGER,
      defaultValue : 0,
      xlabel       : lang.t('fields.orden'),
      field        : 'orden'
    },
    estado: {
      type   : DataTypes.ENUM,
      values : ['ACTIVO', 'INACTIVO'],
      xlabel : lang.t('fields.estado'),
      field  : 'estado'
    }
  };

  // Agregando campos para el log
  fields = util.setTimestamps(fields);

  const Menu = sequelize.define('menu', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'sys_menu'
  });

  return Menu;
};
