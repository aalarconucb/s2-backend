'use strict';

module.exports = function setupOrientacion (api, controllers, middlewares) {
  const { OrientacionController } = controllers;
  api.post('/distrito/orientacion', OrientacionController.crearOrientacion);
  api.get('/distrito/orientacion/:id', OrientacionController.obtenerOrientacion);
  api.get('/distrito/orientacion', OrientacionController.listarOrientaciones);
  api.get('/distrito/orientacion/reporte/fechas', OrientacionController.obtenerReporteOrientaciones);
  api.get('/distrito/orientacion/:id/documento', OrientacionController.generarPdf);
  return api;
};
