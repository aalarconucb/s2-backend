'use strict';

module.exports = function setupInstrumento (api, controllers, middlewares) {
  const { InstrumentoController } = controllers;

  api.post('/distrito/denuncia/:idDenuncia/documento-asistencia-familiar', InstrumentoController.crearDocumentoAsistenciaFamiliar);
  api.post('/distrito/denuncia/documento-asistencia-familiar/:idInstrumento/adjunto', InstrumentoController.adicionarAdjuntoDocumentoAsistenciaFamiliar);
  api.get('/distrito/denuncia/documento-asistencia-familiar/adjunto/:idAdjunto', InstrumentoController.obtenerAdjuntoDocumentoAsistenciaFamiliar);

  api.post('/distrito/denuncia/:idDenuncia/ficha-psicologica', InstrumentoController.crearFichaPsicologica);
  api.post('/distrito/denuncia/:idDenuncia/ficha-seguimiento-legal', InstrumentoController.crearFichaSeguimientoLegal);
  api.post('/distrito/denuncia/:idDenuncia/ficha-seguimiento-psicologico', InstrumentoController.crearFichaSeguimientoPsicologico);

  api.post('/distrito/denuncia/:idDenuncia/ficha-seguimiento-social', InstrumentoController.crearFichaSeguimientoSocial);
  api.post('/distrito/denuncia/ficha-seguimiento-social/:idInstrumento/adjunto', InstrumentoController.adicionarAdjuntoFichaSeguimientoSocial);
  api.get('/distrito/denuncia/ficha-seguimiento-social/adjunto/:idAdjunto', InstrumentoController.obtenerAdjuntoFichaSeguimientoSocial);

  api.post('/distrito/denuncia/:idDenuncia/ficha-social', InstrumentoController.crearFichaSocial);
  api.post('/distrito/denuncia/ficha-social/:idInstrumento/adjunto', InstrumentoController.adicionarAdjuntoFichaSocial);
  api.get('/distrito/denuncia/ficha-social/adjunto/:idAdjunto', InstrumentoController.obtenerAdjuntoFichaSocial);

  api.post('/distrito/denuncia/:idDenuncia/ficha-visita-social', InstrumentoController.crearFichaVisitaSocial);
  api.post('/distrito/denuncia/ficha-visita-social/:idInstrumento/adjunto', InstrumentoController.adicionarAdjuntoFichaVisitaSocial);
  api.get('/distrito/denuncia/ficha-visita-social/adjunto/:idAdjunto', InstrumentoController.obtenerAdjuntoFichaVisitaSocial);

  api.post('/distrito/denuncia/:idDenuncia/informe-legal', InstrumentoController.crearInformeLegal);
  api.post('/distrito/denuncia/:idDenuncia/informe-psicologico', InstrumentoController.crearInformePsicologico);
  api.post('/distrito/denuncia/:idDenuncia/informe-social', InstrumentoController.crearInformeSocial);
  api.post('/distrito/denuncia/:idDenuncia/memorial', InstrumentoController.crearMemorial);

  api.get('/distrito/denuncia/documento-asistencia-familiar/:idInstrumento', InstrumentoController.obtenerDocumentoAsistenciaFamiliar);
  api.get('/distrito/denuncia/ficha-psicologica/:idInstrumento', InstrumentoController.obtenerFichaPsicologica);
  api.get('/distrito/denuncia/ficha-seguimiento-legal/:idInstrumento', InstrumentoController.obtenerFichaSeguimientoLegal);
  api.get('/distrito/denuncia/ficha-seguimiento-psicologico/:idInstrumento', InstrumentoController.obtenerFichaSeguimientoPsicologico);
  api.get('/distrito/denuncia/ficha-seguimiento-social/:idInstrumento', InstrumentoController.obtenerFichaSeguimientoSocial);
  api.get('/distrito/denuncia/ficha-social/:idInstrumento', InstrumentoController.obtenerFichaSocial);
  api.get('/distrito/denuncia/ficha-visita-social/:idInstrumento', InstrumentoController.obtenerFichaVisitaSocial);
  api.get('/distrito/denuncia/informe-legal/:idInstrumento', InstrumentoController.obtenerInformeLegal);
  api.get('/distrito/denuncia/informe-psicologico/:idInstrumento', InstrumentoController.obtenerInformePsicologico);
  api.get('/distrito/denuncia/informe-social/:idInstrumento', InstrumentoController.obtenerInformeSocial);
  api.get('/distrito/denuncia/memorial/:idInstrumento', InstrumentoController.obtenerMemorial);

  api.get('/distrito/denuncia/:idDenuncia/instrumento', InstrumentoController.obtenerInstrumentos);

  api.get('/distrito/denuncia/instrumento/:idInstrumento/adjunto', InstrumentoController.obtenerAdjunto);

  api.post('/distrito/denuncia/:idDenuncia/interrupcion-legal-embarazo', InstrumentoController.crearInterrupcionLegalEmbarazo);
  api.get('/distrito/denuncia/interrupcion-legal-embarazo/:idInstrumento', InstrumentoController.obtenerInterrupcionLegalEmbarazo);
  api.get('/distrito/denuncia/:idDenuncia/interrupcion-legal-embarazo', InstrumentoController.listarInterrupcionLegalEmbarazo);

  api.get('/distrito/denuncia/instrumento/:codigoInstrumento/:idInstrumento/reporte', InstrumentoController.generarInstrumentoPdf);

  return api;
};
