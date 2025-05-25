'use strict';

const util = require('../../lib/util');
const { armarFecha, formatearFecha } = require('../../lib/date');
const lang = require('../../lang')

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id              : util.pk,
    numeroDocumento : {
      type      : DataTypes.STRING(15),
      allowNull : true,
      field     : 'numero_documento'
    },
    fechaNacimiento: {
      type      : DataTypes.DATEONLY,
      allowNull : true,
      field     : 'fecha_nacimiento',
      get       : function () {
        if (this.getDataValue('fechaNacimiento')) {
          return armarFecha(this.getDataValue('fechaNacimiento'));
        }
        return null;
      },
      set: function (value) {
        if (value) {
          this.setDataValue('fechaNacimiento', formatearFecha(value));
        }
      }
    },
    telefono: {
      type      : DataTypes.STRING(50),
      allowNull : true,
      field     : 'telefono'
    },
    nombres: {
      type      : DataTypes.STRING(100),
      allowNull : true,
      field     : 'nombres'
    },
    primerApellido: {
      type      : DataTypes.STRING(100),
      allowNull : true,
      field     : 'primer_apellido'
    },
    segundoApellido: {
      type  : DataTypes.STRING(100),
      field : 'segundo_apellido'
    },
    nombreConvencional: {
      type  : DataTypes.STRING(150),
      field : 'nombre_convencional'
    },
    estaFallecido: {
      type         : DataTypes.BOOLEAN,
      allowNull    : true,
      defaultValue : false,
      field       : 'esta_fallecido',
      comment      : 'Si la persona esta fallecida',
    },
    esCiudadanoDigital: {
      type         : DataTypes.BOOLEAN,
      allowNull    : true,
      defaultValue : false,
      field       : 'es_ciudadano_digital',
      comment      : 'Si la persona es ciudadano digital',
    },
    esSegip: {
      type         : DataTypes.BOOLEAN,
      allowNull    : true,
      defaultValue : false,
      field       : 'es_segip',
      comment      : 'Si la persona ha sido verificada o contrastada con Segip',
    },
    profesionOcupacion: {
      type      : DataTypes.STRING(150),
      allowNull : true,
      field     : 'profesion_ocupacion',
      comment   : 'Profesion/Ocupación de la persona',
    },
    correoElectronico: {
      type      : DataTypes.STRING(100),
      allowNull : true,
      xlabel    : lang.t('fields.correoElectronico'),
      field     : 'correo_electronico'
    },
    complemento: {
      type         : DataTypes.STRING(4),
      allowNull : true,
      defaultValue : null,
      xlabel       : lang.t('fields.complemento'),
      field        : 'complemento',
      comment      : 'Indica complemento del Número de Documento',
    },
    lugarNacimiento: {
      type         : DataTypes.STRING(10),
      allowNull : true,
      defaultValue : null,
      xlabel       : lang.t('fields.lugarNacimiento'),
      field        : 'lugar_nacimiento',
      references: {
        model   : 'sys_dpa',
        key     : 'codigo'
      },
      comment      : 'Indica el codigo del municipio de nacimiento de la persona',
    },
    lugarExpedicion: {
      type         : DataTypes.STRING(10),
      allowNull : true,
      defaultValue : null,
      xlabel       : lang.t('fields.lugarExpedicion'),
      field        : 'lugar_expedicion',
      references: {
        model   : 'sys_dpa',
        key     : 'codigo'
      },
      comment      : 'Indica el codigo del departamento donde se expidio el numero de documento',
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

  const Persona = sequelize.define('persona', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'persona'
  });

  return Persona;
};
