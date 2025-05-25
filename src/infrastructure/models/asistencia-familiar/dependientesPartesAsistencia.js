'use strict';

const util = require('../../lib/util');
const { armarFecha, formatearFecha } = require('../../lib/date');
const lang = require('../../lang');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id    : util.pk,
    idDependiente: {
      type      : DataTypes.UUID,
      allowNull : false,
      field     : 'id_dependiente'
    },
    idParte: {
      type      : DataTypes.UUID,
      allowNull : false,
      field     : 'id_parte'
    },
    idAsistenciaFamiliar: {
      type      : DataTypes.UUID,
      allowNull : false,
      field     : 'id_asistencia_familiar'
    },
    rutaDocumento: {
      type      : DataTypes.STRING(250),
      allowNull : true,
      field     : 'ruta_documento'
    },
    estado: {
      type         : DataTypes.ENUM,
      values       : ['ACTIVO', 'INACTIVO'],
      defaultValue : 'ACTIVO',
      allowNull    : false,
      xlabel       : lang.t('fields.estado'),
      field        : 'estado'
    }
  };

  // Agregando campos para el log
  fields = util.setTimestamps(fields);

  const DependientesPartesAsistencia = sequelize.define('dependientes_partes_asistencia', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'dependientes_partes_asistencia'
  });
  return DependientesPartesAsistencia;
};
