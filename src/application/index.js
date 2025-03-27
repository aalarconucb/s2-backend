'use strict';

const domain = require('../domain');

module.exports = async function setupModule (settings = { iop: true }) {
  try {
    global.IOP = !!settings.iop;
    // Cargando Capa del dominio
    const services = await domain(settings);

    // Agregando Logs a los servicios
    // services.Log = await Logs(config.db);

    return {
      services,
      _models       : services._models,
      _repositories : services._repositories
    };
  } catch (err) {
    console.error(err);
    throw new Error(`Error al instanciar el módulo principal: ${err.message}`);
  }
};
