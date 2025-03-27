'use strict';
const { config } = require('../../../../common');

module.exports = function setupAuth (api, controllers, middlewares) {
  const { AuthController } = controllers;

  api.get('/codigo', AuthController.codigo);

  api.get('/autorizar', AuthController.autorizar);

  api.post('/logout', AuthController.logout);

  return api;
};
