'use strict';

const util = require('../../lib/util');
const { armarFecha, formatearFecha, armarFechaHora, formatearFechaHora } = require('../../lib/date');
const lang = require('../../lang')
const dayjs = require('dayjs');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id  : util.pk,
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
    numeroDocumento : {
      type      : DataTypes.STRING(15),
      allowNull : true,
      field     : 'numero_documento'
    },
    correoElectronico : {
      type      : DataTypes.STRING(300),
      allowNull : true,
      field     : 'correo_electronico'
    },
    celular: {
      type      : DataTypes.STRING(50),
      allowNull : true,
      field     : 'celular'
    },
    tieneWhatsapp: {
      type      : DataTypes.BOOLEAN,
      allowNull : true,
      field     : 'tiene_whatsapp',
      defaultValue : true
    },
    fechaNacimiento : {
      type      : DataTypes.DATEONLY,
      field     : 'fecha_nacimiento',
      allowNull : true,
      get       : function () {
        if (this.getDataValue('fechaNacimiento')) {
          return armarFecha(this.getDataValue('fechaNacimiento'));
        }
        return null;
      },
      set: function (value) {
        this.setDataValue('fechaNacimiento', formatearFecha(value));
      }
    },
    nombreDistritoSlim : {
      type      : DataTypes.STRING(300),
      allowNull : true,
      field     : 'nombre_distrito_slim'
    },
    direccionDistritoSlim : {
      type      : DataTypes.STRING(300),
      allowNull : true,
      field     : 'direccion_distrito_slim'
    },
    telefonoDistritoSlim: {
      type      : DataTypes.STRING(50),
      allowNull : true,
      field     : 'telefono_distrito_slim'
    },
    modalidad: {
      type      : DataTypes.ENUM,
      values    : ['SEPARADO', 'FUSIONADO', 'SEMI FUSIONADO'],
      defaultValue : 'SEPARADO',
      allowNull : false,
      field     : 'modalidad'
    },
    tieneInternet: {
      type      : DataTypes.BOOLEAN,
      allowNull : true,
      field     : 'tiene_internet',
      defaultValue : true
    },
    perfilProfesional: {
      type      : DataTypes.ENUM,
      values    : ['ABOGADO', 'TRABAJADOR SOCIAL', 'PSICOLOGO'],
      defaultValue : 'ABOGADO',
      allowNull : false,
      field     : 'perfil_profesional'
    },
    tipoContrato: {
      type      : DataTypes.ENUM,
      values    : ['CONSULTOR', 'PERSONAL DE PLANTA (ITEM)'],
      defaultValue : 'CONSULTOR',
      allowNull : false,
      field     : 'tipo_contrato'
    },
    duracionContrato: {
      type      : DataTypes.STRING(100),
      allowNull : true,
      field     : 'duracion_contrato'
    },
    fechaInicioContrato: {
      type         : DataTypes.DATEONLY,
      allowNull    : false,
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
    rutaContrato: {
      type      : DataTypes.STRING(250),
      allowNull : true,
      field     : 'ruta_contrato'
    },
    rutaDeclaracionJurada: {
      type      : DataTypes.STRING(250),
      allowNull : true,
      field     : 'ruta_declaracion_jurada'
    },
    rutaDocumentoIdentidad: {
      type      : DataTypes.STRING(250),
      allowNull : true,
      field     : 'ruta_documento_identidad'
    },
    codigoDepartamento: {
      type      : DataTypes.TEXT,
      allowNull : false,
      xlabel    : lang.t('fields.codigoDepartamento'),
      field     : 'codigo_departamento'
    },
    // idPersona: {
    //   type      : DataTypes.UUID,
    //   allowNull : false,
    //   xlabel    : lang.t('fields.idPersona'),
    //   field     : 'id_persona',
    //   references: {
    //     model   : 'persona',
    //     key     : 'id'
    //   }
    // },
    codigoMunicipio: {
      type      : DataTypes.TEXT,
      allowNull : false,
      xlabel    : lang.t('fields.codigoMunicipio'),
      field     : 'codigo_municipio',
      references: {
        model   : 'sys_dpa',
        key     : 'codigo'
      }
    },
    observaciones : {
      type      : DataTypes.STRING(600),
      allowNull : true,
      field     : 'observaciones',
      comment   : 'Almacena observaciones del preregistro'
    },
    estaAprobado : {
      type      : DataTypes.BOOLEAN,
      allowNull : true,
      field     : 'esta_aprobado',
      comment   : 'Estado que indica si el preregitro ha sido aprobado'
    },
    fechaAprobacion : {
      type      : DataTypes.DATE,
      field     : 'fecha_aprobacion',
      allowNull : true,
      get       : function () {
        if (this.getDataValue('fechaAprobacion')) {
          return armarFechaHora(this.getDataValue('fechaAprobacion'));
        }
        return null;
      },
      set: function (value) {
        this.setDataValue('fechaAprobacion', new Date(value));
      }
    },
    // idUsuario : {
    //   type      : DataTypes.STRING(200),
    //   allowNull : true,
    //   field     : 'id_usuario',
    //   comment   : 'Guarda el idUsuario que se creó a partir de la aprobación'
    // },
    estado: {
      type         : DataTypes.ENUM,
      values       : ['ACTIVO', 'INACTIVO', 'VERIFICADO', 'ALTA'],
      defaultValue : 'ACTIVO',
      allowNull    : false,
      xlabel       : lang.t('fields.estado'),
      field        : 'estado'
    }
  };

  // Agregando campos para el log
  fields = util.setTimestamps(fields);

  const Preregistro = sequelize.define('preregistro', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'preregistro'
  });

  Preregistro.beforeSave((instance) => {
    console.log('beforeSave hook triggered');
    if (instance.changed('estaAprobado') && instance.get('estaAprobado') === true) {
      console.log('Setting fechaAprobacion');
      instance.set('fechaAprobacion', dayjs().toISOString());
    }
  });

  return Preregistro;
};
