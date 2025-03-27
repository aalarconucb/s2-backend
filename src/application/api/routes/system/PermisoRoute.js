'use strict';

module.exports = function setupSocio (api, controllers, middlewares) {
  const { PermisoController } = controllers;
  const { AuthMiddleware } = middlewares;

  api.get('/permisos', AuthMiddleware.verificarPermisos(['permisos:listar']), PermisoController.listar);
  api.get('/permisos/:id', AuthMiddleware.verificarPermisos(['permisos:listar']), PermisoController.mostrar);
  api.post('/permisos/', AuthMiddleware.verificarPermisos(['permisos:crear']), PermisoController.crear);
  api.put('/permisos/:id', AuthMiddleware.verificarPermisos(['permisos:actualizar']), PermisoController.actualizar);
  api.delete('/permisos/:id', AuthMiddleware.verificarPermisos(['permisos:eliminar']), PermisoController.eliminar);

  return api;
};
