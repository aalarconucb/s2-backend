'use strict';

const lang = require('../../lang');
const util = require('../../lib/util');
const { armarFecha, formatearFecha } = require('../../lib/date');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id            : util.pk,
    tipoDocumento : {
      type   : DataTypes.STRING(15),
      xlabel : lang.t('fields.tipoDocumento'),
      field  : 'tipo_documento'
    },
    numeroDocumento: {
      type   : DataTypes.STRING(15),
      xlabel : lang.t('fields.numeroDocumento'),
      field  : 'numero_documento'
    },
    complemento: {
      type         : DataTypes.STRING(3),
      defaultValue : null,
      xlabel       : lang.t('fields.complemento'),
      field        : 'complemento'
    },
    fechaNacimiento: {
      type   : DataTypes.DATEONLY,
      xlabel : lang.t('fields.fechaNacimiento'),
      field  : 'fecha_nacimiento',
      get    : function () {
        if (this.getDataValue('fechaNacimiento')) {
          return armarFecha(this.getDataValue('fechaNacimiento'));
        }
        return null;
      },
      set: function (value) {
        this.setDataValue('fechaNacimiento', formatearFecha(value));
      }
    },
    usuario: {
      type   : DataTypes.STRING(100),
      unique : true,
      xlabel : lang.t('fields.usuario')
    },
    contrasena: {
      type      : DataTypes.STRING(500),
      allowNull : true,
      xlabel    : lang.t('fields.contrasena')
    },
    nombres: {
      type      : DataTypes.STRING(100),
      allowNull : true,
      xlabel    : lang.t('fields.nombres'),
      field     : 'nombres'
    },
    primerApellido: {
      type      : DataTypes.STRING(100),
      allowNull : true,
      xlabel    : lang.t('fields.primerApellido'),
      field     : 'primer_apellido'
    },
    segundoApellido: {
      type   : DataTypes.STRING(100),
      xlabel : lang.t('fields.segundoApellido'),
      field  : 'segundo_apellido'
    },
    telefono: {
      type      : DataTypes.STRING(50),
      allowNull : true,
      xlabel    : lang.t('fields.telefono'),
      field     : 'telefono'
    },
    celular: {
      type      : DataTypes.STRING(50),
      allowNull : true,
      xlabel    : lang.t('fields.celular'),
      field     : 'celular'
    },
    correoElectronico: {
      type      : DataTypes.STRING(100),
      allowNull : true,
      xlabel    : lang.t('fields.correoElectronico'),
      field     : 'correo_electronico'
    },
    cargo: {
      type      : DataTypes.STRING(500),
      allowNull : true,
      xlabel    : lang.t('fields.cargo'),
      field     : 'cargo'
    },
    foto: {
      type      : DataTypes.TEXT,
      allowNull : true,
      xlabel    : lang.t('fields.foto'),
      field     : 'foto'
    },
    loginPorCiudadania: {
      type         : DataTypes.BOOLEAN,
      allowNull    : false,
      field        : 'login_por_ciudadania',
      defaultValue : false
    },
    estado: {
      type         : DataTypes.ENUM,
      values       : ['ACTIVO', 'INACTIVO'],
      defaultValue : 'ACTIVO',
      allowNull    : false,
      xlabel       : lang.t('fields.estado'),
      field        : 'estado'
    },
    fechaInicioContrato: {
      type         : DataTypes.DATEONLY,
      allowNull    : true,
      field     : 'fecha_inicio_contrato',
      get       : function () {
        if (this.getDataValue('fechaInicioContrato')) {
          return armarFecha(this.getDataValue('fechaInicioContrato'));
        }
        return null;
      },
      set: function (value) {
        if (value) {
          this.setDataValue('fechaInicioContrato', formatearFecha(value));
        }
      }
    },
    fechaFinContrato: {
      type         : DataTypes.DATEONLY,
      allowNull    : true,
      field     : 'fecha_fin_contrato',
      get       : function () {
        if (this.getDataValue('fechaFinContrato')) {
          return armarFecha(this.getDataValue('fechaFinContrato'));
        }
        return null;
      },
      set: function (value) {
        if (value) {
          this.setDataValue('fechaFinContrato', formatearFecha(value));
        }
      }
    },
    tipoContrato: {
      type      : DataTypes.ENUM,
      values    : ['CONSULTOR', 'PERSONAL DE PLANTA (ITEM)', 'OTRO'],
      defaultValue : 'CONSULTOR',
      allowNull : false,
      field     : 'tipo_contrato'
    },
    tieneWhatsapp: {
      type      : DataTypes.BOOLEAN,
      allowNull : true,
      field     : 'tiene_whatsapp',
      defaultValue : false
    }
  };

  // Agregando campos para el log
  fields = util.setTimestamps(fields);

  const User = sequelize.define('usuario', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'sys_usuario'
  });

  return User;
};
