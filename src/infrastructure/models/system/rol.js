'use strict';

const lang = require('../../lang');
const util = require('../../lib/util');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id        : util.pk,
    idEntidad : {
      type      : DataTypes.UUID,
      allowNull : false,
      xlabel    : lang.t('fields.idEntidad'),
      field     : 'id_entidad'
    },
    nombre: {
      type      : DataTypes.STRING(50),
      allowNull : false,
      xlabel    : lang.t('fields.nombre')
    },
    descripcion: {
      type   : DataTypes.TEXT,
      xlabel : lang.t('fields.descripcion')
    },
    estado: {
      type         : DataTypes.ENUM,
      values       : ['ACTIVO', 'INACTIVO'],
      allowNull    : false,
      defaultValue : 'ACTIVO',
      xlabel       : lang.t('fields.estado'),
      field        : 'estado'
    }
  };

  // Agregando campos para el log
  fields = util.setTimestamps(fields);

  const Rol = sequelize.define('rol', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'sys_rol'
  });

  return Rol;
};
