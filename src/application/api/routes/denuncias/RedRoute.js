'use strict';

module.exports = function setupMunicipio (api, controllers, middlewares) {
  const { RedController } = controllers;

  api.post('/red', RedController.crear);

  api.patch('/red/:idRed', RedController.actualizar);

  api.get('/red', RedController.listar);

  return api;
};
