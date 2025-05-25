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
    // campos estadisticas
    cantidadAbogados: {
      type  : DataTypes.INTEGER,
      field : 'cantidad_abogados'
    },
    cantidadPsicologos: {
      type  : DataTypes.INTEGER,
      field : 'cantidad_psicologos'
    },
    cantidadTrabajadoresSociales: {
      type  : DataTypes.INTEGER,
      field : 'cantidad_trabajadores_sociales'
    },
    infraestructura: {
      type  : DataTypes.INTEGER,
      field : 'infraestructura'
    },
    recepcion: {
      type  : DataTypes.INTEGER,
      field : 'recepcion'
    },
    oficinas: {
      type  : DataTypes.INTEGER,
      field : 'oficinas'
    },
    gabinetePsicologico: {
      type  : DataTypes.INTEGER,
      field : 'gabinete_psicologico'
    },
    banios: {
      type  : DataTypes.INTEGER,
      field : 'banios'
    },
    totalMetrosCuadrados: {
      type  : DataTypes.STRING(20),
      field : 'total_metros_cuadrados'
    },
    precioMetroCuadrado: {
      type  : DataTypes.STRING(20),
      field : 'precio_metro_cuadrado'
    },
    agua: {
      type  : DataTypes.INTEGER,
      field : 'agua'
    },
    energiaElectrica: {
      type  : DataTypes.INTEGER,
      field : 'energia_electrica'
    },
    gas: {
      type  : DataTypes.INTEGER,
      field : 'gas'
    },
    telefonoServicio: {
      type  : DataTypes.INTEGER,
      field : 'telefono_servicio'
    },
    vehiculos: {
      type  : DataTypes.INTEGER,
      field : 'vehiculos'
    },
    motocicletas: {
      type  : DataTypes.INTEGER,
      field : 'motocicletas'
    },
    computadoras: {
      type  : DataTypes.INTEGER,
      field : 'computadoras'
    },
    impresoras: {
      type  : DataTypes.INTEGER,
      field : 'impresoras'
    },
    fotocopiadoras: {
      type  : DataTypes.INTEGER,
      field : 'fotocopiadoras'
    },
    telefonosFijos: {
      type  : DataTypes.INTEGER,
      field : 'telefonos_fijos'
    },
    celularConWhatsapp: {
      type  : DataTypes.INTEGER,
      field : 'celular_con_whatsapp'
    },
    anchoBanda: {
      type  : DataTypes.STRING(20),
      field : 'ancho_banda'
    },
    materialEscritorio: {
      type  : DataTypes.INTEGER,
      field : 'material_escritorio'
    },
    materialLimpieza: {
      type  : DataTypes.INTEGER,
      field : 'material_limpieza'
    },
    materialRecreacion: {
      type  : DataTypes.INTEGER,
      field : 'material_recreacion'
    },
    materialDeportivo: {
      type  : DataTypes.INTEGER,
      field : 'material_deportivo'
    },
    utilesEducacionales: {
      type  : DataTypes.INTEGER,
      field : 'utiles_educacionales'
    },
    combustibleOtrasEnergias: {
      type  : DataTypes.INTEGER,
      field : 'combustible_otras_energias'
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

  const Distrito = sequelize.define('distrito', fields, {
    paranoid   : true,
    timestamps : true,
    tableName  : 'distrito'
  });

  return Distrito;
};
