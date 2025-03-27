'use strict';

const { setTimestampsSeeder } = require('../lib/util');

let items = [
  { id: '745034da-06cb-4d98-8fee-4c982adfbb22',  nombre: 'FUNDACION CONSTRUIR', descripcion: 'FUNDACION CONSTRUIR', sigla: 'FNC', web: 'https://pbs.twimg.com/profile_images/1351275781515784196/EINZDxAk_400x400.png', email: 'min@gmail.com',   direccion: 'Av. 16 de Julio NRO 2020',  telefono: '78745815',    estado: 'ACTIVO', nivel: 1,  id_entidad: null },
  { id: '3f5faa14-cd56-465e-afd4-f81415859982',  nombre: 'FUNDACION PATIÑO', descripcion: 'FUNDACION PATIÑO', sigla: 'FPT', web: 'https://pbs.twimg.com/profile_images/1351275781515784196/EINZDxAk_400x400.png', email: 'trabajo@gmail.com',   direccion: 'Calle Onda Nro. 1145',  telefono: '60525634',    estado: 'ACTIVO', nivel: 1,  id_entidad: null }
];

// Asignando datos de log y timestamps a los datos
items = setTimestampsSeeder(items);

module.exports = {
  up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('sys_entidad', items, {})
      .then(async () => {})
      .catch(error => {
        if (error.message.indexOf('already exists') > -1) return;
        console.error(error);
        // logger.error(error)
      });
  },

  down (queryInterface, Sequelize) { }
};
