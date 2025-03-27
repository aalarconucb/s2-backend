'use strict';

const { setTimestampsSeeder } = require('../lib/util');
const { saltRounds } = require('../../common/config/auth');
const bcrypt = require('bcrypt');

// Datos de producción
let items = [
  {
    id                 : '7171272e-b31b-4c34-9220-9f535c958c5c',
    id_entidad         : '745034da-06cb-4d98-8fee-4c982adfbb22',
    numero_documento   : '9248643',
    complemento        : '',
    tipo_documento     : 'CI',
    fecha_nacimiento   : '1993-08-15',
    cargo              : 'CARGO',
    usuario            : 'admin',
    contrasena         : bcrypt.hashSync('Developer', saltRounds),
    nombres            : 'Admin',
    primer_apellido    : 'Admin',
    segundo_apellido   : 'Admin',
    correo_electronico : 'admin@yopmail.com',
    celular            : '',
    estado             : 'ACTIVO'
  }
];

items = setTimestampsSeeder(items);

module.exports = {
  up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('sys_usuario', items, {})
      .then(async () => {})
      .catch(error => {
        if (error.message.indexOf('already exists') > -1) return;
        console.error(error);
      });
  },
  down (queryInterface, Sequelize) {}
};
