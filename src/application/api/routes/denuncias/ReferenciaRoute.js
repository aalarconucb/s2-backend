'use strict';

module.exports = function setupInstrumento (api, controllers, middlewares) {
  const { ReferenciaController } = controllers;

  api.post('/distrito/denuncia/:idDenuncia/ficha-referencia', ReferenciaController.crearReferencia);
  api.get('/distrito/denuncia/:idDenuncia/ficha-referencia', ReferenciaController.obtenerReferencias);
  api.get('/distrito/denuncia/ficha-referencia/:idReferencia/reporte', ReferenciaController.generarPdfReferencia);
  api.get('/distrito/denuncia/ficha-referencia/:idReferencia', ReferenciaController.obtenerReferencia);

  api.post('/distrito/denuncia/:idDenuncia/ficha-contra-referencia', ReferenciaController.crearContraReferencia);
  api.get('/distrito/denuncia/:idDenuncia/ficha-contra-referencia', ReferenciaController.obtenerContraReferencias);
  api.get('/distrito/denuncia/ficha-contra-referencia/:idContraReferencia/reporte', ReferenciaController.generarPdfContraReferencia);
  api.get('/distrito/denuncia/ficha-contra-referencia/:idContraReferencia', ReferenciaController.obtenerContraReferencia);
  api.get('/distrito/denuncia/ficha-contra-referencia/:idContraReferencia/adjunto', ReferenciaController.obtenerAdjuntoContraReferencia);

  return api;
};
