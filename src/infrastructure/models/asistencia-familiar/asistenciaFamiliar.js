'use strict';

const util = require('../../lib/util');
const { armarFecha, formatearFecha } = require('../../lib/date');
const lang = require('../../lang');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id    : util.pk,
    tipoAsistencia: {
      type      : DataTypes.ENUM,
      values    : ['DINERO', 'ESPECIES'],
      defaultValue : 'DINERO',
      allowNull : false,
      field     : 'tipo_asistencia',
      comment   : 'Tipo de asistencia: Dinero o Especies'
    },
    montoDinero: {
      type      : DataTypes.DECIMAL(10, 2),
      allowNull : true,
      field     : 'monto_dinero',
      comment   : 'Monto de asistencia en dinero (si corresponde)',
    },
    montoEspecies: {
      type      : DataTypes.TEXT,
      allowNull : true,
      field     : 'monto_especies',
      comment   : 'Descripción de las especies en caso de asistencia en especie',
    },
    regimenVisitas: {
      type      : DataTypes.TEXT,
      allowNull : true,
      field     : 'regimen_visitas',
      comment   : 'Descripción del régimen de visitas',
    },
    razonSolicitud: {
      type      : DataTypes.TEXT,
      allowNull : false,
      field     : 'razon_solicitud',
      comment   : 'Razón por la cual se solicita la asistencia familiar',
    },
    descripcionEspecies: {
      type      : DataTypes.TEXT,
      allowNull : true,
      field     : 'descripcion_especies',
      comment   : 'Descripción de las especies de la asistencia familiar',
    },
    fechaInicioPago : {
      type      : DataTypes.DATEONLY,
      field     : 'fecha_inicio_pago',
      allowNull : false,
      get       : function () {
        if (this.getDataValue('fechaInicioPago')) {
          return armarFecha(this.getDataValue('fechaInicioPago'));
        }
        return null;
      },
      set: function (value) {
        this.setDataValue('fechaInicioPago', formatearFecha(value));
      }
    },
    fechaLimitePago: {
      type      : DataTypes.STRING(5),
      allowNull : true,
      field     : 'fecha_limite_pago',
      comment   : 'Fecha límite de pago (solo día y mes DD-MM)',
    },
    diaLimitePago: {
      type      : DataTypes.INTEGER,
      allowNull : true,
      field     : 'dia_limite_pago',
      comment   : 'Día límite de pago (solo entre 1 y 30)',
    },
    modoPago: {
      type      : DataTypes.ENUM('TRANSFERENCIA', 'EFECTIVO', 'OTRO'),
      defaultValue : 'TRANSFERENCIA',
      allowNull : true,
      field     : 'modo_pago',
      comment   : 'Modalidad de pago: Transferencia o Efectivo',
    },
    modalidadPago: {
      type      : DataTypes.TEXT,
      allowNull : true,
      field     : 'modalidad_pago',
      comment   : 'Descripción de la modalidad de pago',
    },
    condicionesEspecificas: {
      type      : DataTypes.TEXT,
      allowNull : true,
      field     : 'condiciones_especificas',
      comment   : 'Cualquier condición específica relacionada con la asistencia familiar',
    },
    rutaDocumento: {
      type      : DataTypes.STRING(250),
      allowNull : true,
      field     : 'ruta_documento'
    },
    codigoDivisa: {
      type      : DataTypes.STRING(4),
      allowNull : true,
      field     : 'codigo_divisa',
      comment   : 'Codigo Divisa Ej. BOB - Bolivianos',
    },
    estado: {
      type         : DataTypes.ENUM,
      values       : ['ACTIVO', 'INACTIVO', 'SUSCRITO', 'HOMOLOGADO', 'DEMANDA', 'OTRO'],
      defaultValue : 'ACTIVO',
      allowNull    : false,
      xlabel       : lang.t('fields.estado'),
      field        : 'estado'
    },
    tieneDenuncia: {
      type         : DataTypes.BOOLEAN,
      allowNull    : true,
      defaultValue : false,
      field        : 'tiene_denuncia',
      comment      : 'Si la Asistencia tiene Denuncia relacionada',
    },
    observaciones: {
      type      : DataTypes.TEXT,
      allowNull : true,
      field     : 'observaciones'
    },
    fechaFinAsistencia : {
      type      : DataTypes.DATEONLY,
      field     : 'fecha_fin_asistencia',
      allowNull : true,
      get       : function () {
        if (this.getDataValue('fechaFinAsistencia')) {
          return armarFecha(this.getDataValue('fechaFinAsistencia'));
        }
        return null;
      },
      set: function (value) {
        this.setDataValue('fechaFinAsistencia', formatearFecha(value));
      }
    },
    idDenuncia: {
      type      : DataTypes.UUID,
      allowNull : true,
      field     : 'id_denuncia',
      references: {
        model   : 'denuncia',
        key     : 'id'
      },
      comment   : 'Id de Denuncia relacionada',
    },
    idDistrito: {
      type      : DataTypes.UUID,
      allowNull : true,
      field     : 'id_distrito',
      references: {
        model   : 'distrito',
        key     : 'id'
      },
      comment   : 'Id del Distrito a cual esta relacionado',
    }
  };

  // Agregando campos para el log
  fields = util.setTimestamps(fields);

  const AsistenciaFamiliar = sequelize.define('asistencia_familiar', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'asistencia_familiar'
  });

  return AsistenciaFamiliar;
};
