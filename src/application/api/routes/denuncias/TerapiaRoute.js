'use strict';

module.exports = function setupInstrumento (api, controllers, middlewares) {
  const { TerapiaController } = controllers;

  api.post('/distrito/denuncia/:idDenuncia/terapia-slim', TerapiaController.crearTerapiaSlim);
  api.get('/distrito/denuncia/terapia-slim/:idInstrumento', TerapiaController.obtenerTerapiaSlim);
  api.get('/distrito/denuncia/:idDenuncia/terapia-slim', TerapiaController.listarTerapiasSlim);

  api.post('/distrito/denuncia/:idDenuncia/terapia-externa', TerapiaController.crearTerapiaExterna);
  api.get('/distrito/denuncia/terapia-externa/:idInstrumento', TerapiaController.obtenerTerapiaExterna);
  api.get('/distrito/denuncia/:idDenuncia/terapia-externa', TerapiaController.listarTerapiasExternas);

  api.get('/distrito/denuncia/terapia-externa/:idInstrumento/adjunto', TerapiaController.obtenerAdjunto);

  api.post('/distrito/denuncia/:idDenuncia/certificado-medico', TerapiaController.crearCertificadoMedico);
  api.get('/distrito/denuncia/certificado-medico/:idInstrumento', TerapiaController.obtenerCertificadoMedico);
  api.get('/distrito/denuncia/:idDenuncia/certificado-medico', TerapiaController.listarCertificadosMedicos);
  api.get('/distrito/denuncia/certificado-medico/:idInstrumento/adjunto', TerapiaController.obtenerAdjuntoCertificadoMedico);

  api.post('/distrito/denuncia/:idDenuncia/nota-externa', TerapiaController.crearNotaExterna);
  api.get('/distrito/denuncia/nota-externa/:idInstrumento', TerapiaController.obtenerNotaExterna);
  api.get('/distrito/denuncia/:idDenuncia/nota-externa', TerapiaController.listarNotasExternas);
  api.get('/distrito/denuncia/nota-externa/:idInstrumento/adjunto', TerapiaController.obtenerAdjuntoNotaExterna);

  api.post('/distrito/denuncia/:idDenuncia/citacion', TerapiaController.crearCitacion);
  api.get('/distrito/denuncia/citacion/:idInstrumento', TerapiaController.obtenerCitacion);
  api.get('/distrito/denuncia/citacion', TerapiaController.listarCitaciones);

  // api.post('/distrito/requerimiento-fiscal', TerapiaController.crearRequerimientoFiscal);
  // api.get('/distrito/requerimiento-fiscal/:idRequerimientoFiscal', TerapiaController.obtenerRequerimientoFiscal);
  // api.get('/distrito/requerimiento-fiscal', TerapiaController.listarRequerimientosFiscales);
  // api.get('/distrito/requerimiento-fiscal/:idRequerimientoFiscal/adjunto', TerapiaController.obtenerAdjuntoRequerimientoFiscal);
  return api;
};
