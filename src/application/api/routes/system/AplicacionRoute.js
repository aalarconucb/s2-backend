'use strict';
module.exports = function setupSocio (api, controllers, middlewares) {
  const { AplicacionController } = controllers;
  const { AuthMiddleware } = middlewares;

  api.get('/aplicaciones', AuthMiddleware.verificarPermisos(['aplicaciones:listar']), AplicacionController.listar);
  api.get('/aplicaciones/:id', AuthMiddleware.verificarPermisos(['aplicaciones:listar']), AplicacionController.findOne);
  api.post('/aplicaciones', AuthMiddleware.verificarPermisos(['aplicaciones:crear']), AplicacionController.crear);
  api.put('/aplicaciones/:id', AuthMiddleware.verificarPermisos(['aplicaciones:actualizar']), AplicacionController.actualizar);
  api.delete('/aplicaciones/:id', AuthMiddleware.verificarPermisos(['aplicaciones:eliminar']), AplicacionController.eliminar);

  api.get('/aplicaciones/:id/permisos', AuthMiddleware.verificarPermisos(['aplicaciones:crear', 'aplicaciones:actualizar']), AplicacionController.listarPermisos);

  return api;
};
