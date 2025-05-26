'use strict';

module.exports = function setupSolicitudAtencion (api, controllers, middlewares) {
  const { SolicitudAtencionController } = controllers;

  api.post('/distrito/denuncia/:idDenuncia/solicitud-atencion', SolicitudAtencionController.crear);

  api.get('/distrito/denuncia/:idDenuncia/solicitud-atencion', SolicitudAtencionController.obtenerSolicitudesPorDenuncia);

  api.get('/distrito/denuncia/solicitud-atencion', SolicitudAtencionController.obtenerSolicitudes);

  return api;
};
