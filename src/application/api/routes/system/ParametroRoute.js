'use strict';

module.exports = function setupParametro (api, controllers, middlewares) {
  const { ParametroController } = controllers;

  api.get('/parametros', ParametroController.findAll);
  api.get('/parametros/:id', ParametroController.findOne);
  api.post('/parametros', ParametroController.crear);
  api.put('/parametros/:id', ParametroController.actualizar);
  api.delete('/parametros/:id', ParametroController.eliminar);

  return api;
};
