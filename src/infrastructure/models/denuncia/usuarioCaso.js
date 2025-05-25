'use strict';

const util = require('../../lib/util');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id        : util.pk,
    idUsuario : {
      type      : DataTypes.UUID,
      allowNull : false,
      field     : 'id_usuario'
    },
    idDenuncia: {
      type      : DataTypes.UUID,
      allowNull : false,
      field     : 'id_denuncia'
    },
    estado: {
      type         : DataTypes.ENUM,
      values       : ['CREADO', 'ASIGNADO', 'FINALIZADO'],
      defaultValue : 'CREADO',
      allowNull    : false,
      field        : 'estado'
    },
    paso: {
      type      : DataTypes.INTEGER,
      allowNull : false,
      field     : 'paso'
    },
    horas: {
      type      : DataTypes.INTEGER,
      allowNull : false,
      field     : 'horas'
    },
    instrumentos: {
      type      : DataTypes.JSONB,
      allowNull : false,
      field     : 'instrumentos'
    }
  };

  // Agregando campos para el log
  fields = util.setTimestamps(fields);

  const UsuarioCaso = sequelize.define('usuario_caso', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'usuario_caso'
  });

  return UsuarioCaso;
};
