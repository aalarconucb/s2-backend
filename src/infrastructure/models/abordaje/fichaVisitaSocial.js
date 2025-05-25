'use strict';

const util = require('../../lib/util');
const { armarFecha, formatearFecha } = require('../../lib/date');

module.exports = (sequelize, DataTypes) => {
  let fields = {
    id    : util.pk,
    fecha : {
      type      : DataTypes.DATEONLY,
      field     : 'fecha',
      allowNull : false,
      get       : function () {
        if (this.getDataValue('fecha')) {
          return armarFecha(this.getDataValue('fecha'));
        }
        return null;
      },
      set: function (value) {
        this.setDataValue('fecha', formatearFecha(value));
      }
    },
    datosResponsable: {
      type      : DataTypes.TEXT,
      allowNull : false,
      field     : 'datos_responsable'
    },
    propositoVisita: {
      type      : DataTypes.TEXT,
      allowNull : false,
      field     : 'proposito_visita'
    },
    tenenciaVivienda: {
      type      : DataTypes.JSONB,
      allowNull : true,
      field     : 'tenencia_vivienda'
    },
    tenenciaViviendaOtro: {
      type      : DataTypes.TEXT,
      allowNull : true,
      field     : 'tenencia_vivienda_otro'
    },
    tipoConstruccion: {
      type      : DataTypes.JSONB,
      allowNull : true,
      field     : 'tipo_construccion'
    },
    tipoConstruccionOtro: {
      type      : DataTypes.TEXT,
      allowNull : true,
      field     : 'tipo_construccion_otro'
    },
    tipoPiso: {
      type      : DataTypes.JSONB,
      allowNull : true,
      field     : 'tipo_piso'
    },
    tipoPisoOtro: {
      type      : DataTypes.TEXT,
      allowNull : true,
      field     : 'tipo_piso_otro'
    },
    tipoTecho: {
      type      : DataTypes.JSONB,
      allowNull : true,
      field     : 'tipo_techo'
    },
    tipoTechoOtro: {
      type      : DataTypes.TEXT,
      allowNull : true,
      field     : 'tipo_techo_otro'
    },
    estructuraVivienda: {
      type      : DataTypes.JSONB,
      allowNull : true,
      field     : 'estructura_vivienda'
    },
    estructuraViviendaOtro: {
      type      : DataTypes.TEXT,
      allowNull : true,
      field     : 'estructura_vivienda_otro'
    },
    serviciosBasicos: {
      type      : DataTypes.JSONB,
      allowNull : true,
      field     : 'servicios_basicos'
    },
    serviciosBasicosOtro: {
      type      : DataTypes.TEXT,
      allowNull : true,
      field     : 'servicios_basicos_otro'
    },
    luz: {
      type      : DataTypes.JSONB,
      allowNull : true,
      field     : 'luz'
    },
    luzOtro: {
      type      : DataTypes.TEXT,
      allowNull : true,
      field     : 'luz_otro'
    },
    servicioSanitario: {
      type      : DataTypes.JSONB,
      allowNull : true,
      field     : 'servicio_sanitario'
    },
    servicioSanitarioOtro: {
      type      : DataTypes.TEXT,
      allowNull : true,
      field     : 'servicio_sanitario_otro'
    },
    calidadVivienda: {
      type      : DataTypes.JSONB,
      allowNull : true,
      field     : 'calidad_vivienda'
    },
    calidadViviendaOtro: {
      type      : DataTypes.TEXT,
      allowNull : true,
      field     : 'calidad_vivienda_otro'
    },
    descripcionAmbientes: {
      type      : DataTypes.TEXT,
      allowNull : true,
      field     : 'descripcion_ambientes'
    },
    descripcionGeneral: {
      type      : DataTypes.TEXT,
      allowNull : true,
      field     : 'descripcion_general'
    },
    ingresoEconomico: {
      type      : DataTypes.TEXT,
      allowNull : true,
      field     : 'ingreso_economico'
    },
    egresoEconomico: {
      type      : DataTypes.TEXT,
      allowNull : true,
      field     : 'egreso_economico'
    },
    observacionesSalud: {
      type      : DataTypes.TEXT,
      allowNull : true,
      field     : 'observaciones_salud'
    },
    observacionesEducacion: {
      type      : DataTypes.TEXT,
      allowNull : true,
      field     : 'observaciones_educacion'
    },
    accionesRealizar: {
      type      : DataTypes.TEXT,
      allowNull : false,
      field     : 'acciones_realizar'
    },
    accionSeguimiento: {
      type      : DataTypes.TEXT,
      allowNull : true, //
      field     : 'accion_seguimiento'
    },
    observaciones: {
      type      : DataTypes.TEXT,
      allowNull : true,
      field     : 'observaciones'
    },
    rutaDocumento: {
      type      : DataTypes.STRING(150),
      allowNull : true,
      field     : 'ruta_documento'
    },
    profesional: {
      type      : DataTypes.STRING(150),
      allowNull : true,
      field     : 'profesional',
      comment   : 'Este campo almacena el nombre del profesional relacionado con el registro.'
    },
    estado: {
      type         : DataTypes.ENUM,
      values       : ['ACTIVO', 'INACTIVO'],
      defaultValue : 'ACTIVO',
      allowNull    : false,
      field        : 'estado'
    }
  };

  // Agregando campos para el log
  fields = util.setTimestamps(fields);

  const FichaVisitaSocial = sequelize.define('ficha_visita_social', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'ficha_visita_social'
  });

  return FichaVisitaSocial;
};
