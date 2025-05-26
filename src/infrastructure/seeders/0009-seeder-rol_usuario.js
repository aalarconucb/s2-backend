'use strict';

const {
  setTimestampsSeeder, textToUuid
} = require('../lib/util');

// Datos de producción
let items = [
  { id: '556f20d7-8db4-437c-9606-27ae81aff072', id_rol: textToUuid('ADMINISTRADOR'), id_usuario: '7171272e-b31b-4c34-9220-9f535c958c5c' }
];
items = setTimestampsSeeder(items);

module.exports = {
  up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('sys_rol_usuario', items, {})
      .then(async () => {})
      .catch(error => {
        if (error.message.indexOf('already exists') > -1) return;
        console.error(error);
      });
  },
  down (queryInterface, Sequelize) {}
};
