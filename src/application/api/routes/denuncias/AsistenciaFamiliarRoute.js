'use strict';

module.exports = function setupAsistenciaFamiliar (api, controllers, middlewares) {
  const { AsistenciaFamiliarController } = controllers;

  api.get('/distrito/asistencia-familiar/listar', AsistenciaFamiliarController.listar);
  api.get('/distrito/asistencia-familiar/:id', AsistenciaFamiliarController.findById);
  api.post('/distrito/asistencia-familiar', AsistenciaFamiliarController.crear);
  api.patch('/distrito/asistencia-familiar/:idAsistenciaFamiliar', AsistenciaFamiliarController.actualizar);
  api.patch('/distrito/asistencia-familiar/:idAsistenciaFamiliar/estado', AsistenciaFamiliarController.actualizarEstado);
  api.get('/distrito/asistencia-familiar/:idAsistenciaFamiliar/documento', AsistenciaFamiliarController.generarDocumento);
  return api;
};
