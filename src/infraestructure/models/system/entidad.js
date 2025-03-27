'use strict';

const lang = require('../../lang');
const util = require('../../lib/util');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id     : util.pk,
    nombre : {
      type      : DataTypes.STRING(400),
      allowNull : false,
      xlabel    : lang.t('fields.nombre')
    },
    descripcion: {
      type      : DataTypes.STRING(400),
      allowNull : false,
      xlabel    : lang.t('fields.descripcion')
    },
    sigla: {
      type      : DataTypes.STRING(50),
      allowNull : false,
      xlabel    : lang.t('fields.sigla')
    },

    email: {
      type      : DataTypes.TEXT,
      allowNull : false,
      xlabel    : lang.t('fields.email'),
      field     : 'email'
    },
    web: {
      type      : DataTypes.TEXT,
      allowNull : false,
      xlabel    : lang.t('fields.web'),
      field     : 'web'
    },
    direccion: {
      type   : DataTypes.TEXT,
      xlabel : lang.t('fields.direccion'),
      field  : 'direccion'
    },
    telefono: {
      type   : DataTypes.STRING(15),
      xlabel : lang.t('fields.telefono'),
      field  : 'telefono'
    },
    estado: {
      type         : DataTypes.ENUM,
      values       : ['ACTIVO', 'INACTIVO'],
      defaultValue : 'ACTIVO',
      allowNull    : false,
      xlabel       : lang.t('fields.estado'),
      field        : 'estado'
    },
    idEntidad: {
      type      : DataTypes.UUID,
      allowNull : true,
      xlabel    : lang.t('fields.idEntidad'),
      field     : 'id_entidad'
    },
    nivel: {
      type         : DataTypes.INTEGER,
      allowNull    : false,
      defaultValue : 0,
      xlabel       : lang.t('fields.nivel'),
      field        : 'nivel'
    }
  };

  // Agregando campos para el log
  fields = util.setTimestamps(fields);

  const Entidad = sequelize.define('entidad', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'sys_entidad'
  });

  return Entidad;
};
