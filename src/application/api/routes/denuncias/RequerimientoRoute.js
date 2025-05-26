'use strict';

module.exports = function setupInstrumento (api, controllers) {
  const { RequerimientoController } = controllers;

  api.post('/distrito/requerimiento-informe', RequerimientoController.crear);
  api.get('/distrito/requerimiento-informe/:id', RequerimientoController.obtener);
  api.get('/distrito/requerimiento-informe', RequerimientoController.listar);
  api.get('/distrito/requerimiento-informe/:id/adjunto', RequerimientoController.obtenerAdjunto);
  api.get('/distrito/requerimiento-informe/:id/documento', RequerimientoController.obtenerDocumento);
  api.get('/distrito/requerimiento-informe/reporte/fechas', RequerimientoController.reporteFechas)
  return api;
};
