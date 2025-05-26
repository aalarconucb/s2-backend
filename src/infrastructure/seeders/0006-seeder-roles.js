'use strict';

const { setTimestampsSeeder, textToUuid, addKey } = require('../lib/util');

let items = [
  //{ id: '88b0104c-1bd1-42b2-bb01-9bf0502bab5a', id_entidad: '745034da-06cb-4d98-8fee-4c982adfbb22', nombre: 'ROL SUPER ADMIN', descripcion: 'Rol administrador.', estado: 'ACTIVO' },
  {
    id          : textToUuid('ADMINISTRADOR'),
    nombre      : 'ADMINISTRADOR',
    descripcion : 'Administrador',
    tipo        : 'nacional',
    estado      : 'ACTIVO'
  },
  {
    id          : textToUuid('SUPERVISOR_NACIONAL'),
    nombre      : 'SUPERVISOR_NACIONAL',
    descripcion : 'Supervisor Nacional',
    tipo        : 'nacional',
    estado      : 'ACTIVO'
  },
  {
    id          : textToUuid('SUPERVISOR_DEPARTAMENTAL'),
    nombre      : 'SUPERVISOR_DEPARTAMENTAL',
    descripcion : 'Supervisor Departamental',
    tipo        : 'departamental',
    estado      : 'ACTIVO'
  },
  {
    id          : textToUuid('SUPERVISOR_MUNICIPAL'),
    nombre      : 'SUPERVISOR_MUNICIPAL',
    descripcion : 'Supervisor Municipal',
    tipo        : 'municipal',
    estado      : 'ACTIVO'
  },
  {
    id          : textToUuid('ADMINISTRADOR_MUNICIPAL'),
    nombre      : 'ADMINISTRADOR_MUNICIPAL',
    descripcion : 'Administrador Municipal',
    tipo        : 'municipal',
    estado      : 'ACTIVO'
  },
  {
    id          : textToUuid('ABOGADO'),
    nombre      : 'ABOGADO',
    descripcion : 'Abogado',
    tipo        : 'distrital',
    estado      : 'ACTIVO'
  },
  {
    id          : textToUuid('PSICOLOGO'),
    nombre      : 'PSICOLOGO',
    descripcion : 'Psicologo',
    tipo        : 'distrital',
    estado      : 'ACTIVO'
  },
  {
    id          : textToUuid('TRABAJADOR_SOCIAL'),
    nombre      : 'TRABAJADOR_SOCIAL',
    descripcion : 'Trabajador Social',
    tipo        : 'distrital',
    estado      : 'ACTIVO'
  },
  {
    id          : textToUuid('VERIFICADOR'),
    nombre      : 'VERIFICADOR_USUARIOS',
    descripcion : 'Verificador de Preregistros y Usuarios',
    tipo        : 'nacional',
    estado      : 'ACTIVO'
  }
];

// Asignando datos de log y timestamps a los datos
items = setTimestampsSeeder(items);
//items = addKey(items);

module.exports = {
  up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('sys_rol', items, {})
      .then(async () => {})
      .catch(error => {
        if (error.message.indexOf('already exists') > -1) return;
        console.error(error);
        // logger.error(error)
      });
  },

  down (queryInterface, Sequelize) { }
};
