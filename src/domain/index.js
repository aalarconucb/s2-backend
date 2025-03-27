'use strict';

const debug = require('debug')('app:domain');
const db = require('../infrastructure');
const { config, errors } = require('../common');
const util = require('./lib/util');
const path = require('path');

module.exports = async function initDomain (settings = { iop: true }) {
  global.IOP = !!settings.iop;
  // Obteniendo repositorios de la capa de infrastructura
  const repositories = await db(config.db).catch(errors.handleFatalError);

  // Iniciando el módulo de logs
  // const logs = await Logs(config.db).catch(errors.handleFatalError);
  // repositories.Log = logs;

  const helpers = await util.loadHelpers(path.join(__dirname, 'helpers'));
  // Carga todos los servicios que se encuentran en la carpeta services y en sus subcarpetas, adjuntando logs
  const services = util.loadServices(path.join(__dirname, 'services'), repositories, { exclude: ['index.js', 'Service.js'], excludeRegex: [/[~|#]$/, /^(.#)/] }, {}, helpers);
  debug('Capa del dominio - Servicios cargados');

  // Asignando modelos y repositories de la capa de infrastructura
  services._models = repositories._models;
  services._repositories = repositories;

  return services;
};
