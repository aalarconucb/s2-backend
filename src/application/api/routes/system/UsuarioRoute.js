'use strict';

module.exports = function setupUsuario (api, controllers, middlewares) {
  const { UsuarioController } = controllers;
  const { AuthMiddleware } = middlewares;

  api.get('/usuarios', AuthMiddleware.verificarPermisos(['usuarios:listar']), UsuarioController.listar);
  api.get('/usuarios/:id', AuthMiddleware.verificarPermisos(['usuarios:listar']), UsuarioController.mostrar);
  api.post('/usuarios', AuthMiddleware.verificarPermisos(['usuarios:crear']), UsuarioController.crear);
  api.put('/usuarios/:id', AuthMiddleware.verificarPermisos(['usuarios:actualizar']), UsuarioController.actualizar);
  api.delete('/usuarios/:id', AuthMiddleware.verificarPermisos(['usuarios:eliminar']), UsuarioController.eliminar);

  api.put('/usuarios/cambiar-contrasena/:id', UsuarioController.cambiarContrasena);

  return api;
};
