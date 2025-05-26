"use strict";

const { setTimestampsSeeder, textToUuid } = require("../lib/util");

let items = [
  {
    id: textToUuid("Cintis"),
    nombre: "Red Local Cintis",
    descripcion: "Red de Chuquisaca",
    estado: "ACTIVO",
  },
  {
    id: textToUuid("AltiplanoSur"),
    nombre: "Red Local Altiplano Sur",
    descripcion: "Red de La Paz",
    estado: "ACTIVO",
  },
  {
    id: textToUuid("Chichas"),
    nombre: "Red Local Chichas",
    descripcion: "Red de Potosi",
    estado: "ACTIVO",
  },
  {
    id: textToUuid("GuardianesFrontera"),
    nombre: "Red Local Guardianes de la Frontera",
    descripcion: "Red de Oruro",
    estado: "ACTIVO",
  },
  {
    id: textToUuid("Litoral"),
    nombre: "Red Local Litoral",
    descripcion: "Red de Oruro",
    estado: "ACTIVO",
  },
  {
    id: textToUuid("Minera"),
    nombre: "Red Local Minera",
    descripcion: "Red de Oruro",
    estado: "ACTIVO",
  },
  {
    id: textToUuid("Occidente"),
    nombre: "Red Local Occidente",
    descripcion: "Red de Oruro",
    estado: "ACTIVO",
  },
  {
    id: textToUuid("RafaelBustillos"),
    nombre: "Red Local Rafael Bustillos",
    descripcion: "Red de Potosi",
    estado: "ACTIVO",
  },
  {
    id: textToUuid("Urinsaya"),
    nombre: "Red Local Urinsaya",
    descripcion: "Red de Oruro",
    estado: "ACTIVO",
  },
  {
    id: textToUuid("Yungas"),
    nombre: "Red Local Yungas",
    descripcion: "Red de La Paz",
    estado: "ACTIVO",
  },
];

// Asignando datos de log y timestamps a los datos
items = setTimestampsSeeder(items);

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface
      .bulkInsert("red", items, {})
      .then(async () => {})
      .catch((error) => {
        if (error.message.indexOf("already exists") > -1) return;
        console.error(error);
        // logger.error(error)
      });
  },

  down(queryInterface, Sequelize) {},
};
