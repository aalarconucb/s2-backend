'use strict';
const menuSchema = require('../../schemas/system/MenuSchema');

module.exports = function setupSocio (api, controllers, middlewares) {
  const { MenuController } = controllers;
  const { AuthMiddleware, SchemaMiddleware } = middlewares;

  api.get('/menus', AuthMiddleware.verificarPermisos(['menus:listar']),  MenuController.listar);
  api.get('/menus/:id', AuthMiddleware.verificarPermisos(['menus:listar']), MenuController.mostrar);
  api.post('/menus/', AuthMiddleware.verificarPermisos(['menus:crear']), MenuController.crear);
  api.put('/menus/:id', AuthMiddleware.verificarPermisos(['menus:actualizar']), MenuController.actualizar);
  api.delete('/menus/:id', AuthMiddleware.verificarPermisos(['menus:eliminar']), MenuController.eliminar);

  return api;
};
