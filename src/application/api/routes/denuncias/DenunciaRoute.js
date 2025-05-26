'use strict';
const { crearDenuncia } = require('../../validations/DenunciaValidation');

module.exports = function setupDenuncia (api, controllers, middlewares) {
  const { DenunciaController, UsuarioCasoController } = controllers;
  const { SchemaMiddleware } = middlewares;

  api.post('/distrito/:idDistrito/denuncia',
    SchemaMiddleware.validarSchema(
      crearDenuncia
    ), DenunciaController.crear);

  api.put('/distrito/denuncia/:idDenuncia/asignar/:idUsuario', DenunciaController.asignarCaso);

  api.get('/distrito/:idDistrito/denuncia', DenunciaController.listarDenuncias);

  api.get('/distrito/denuncia', DenunciaController.listarDenunciasPorRol);

  //api para listar denuncias de un usuario especifico
  api.get('/distrito/denuncia/usuario', DenunciaController.listarDenunciasPorUsuario);

  api.patch('/distrito/denuncia/:idDenuncia', DenunciaController.actualizar);

  api.get('/distrito/denuncia/:idDenuncia/reporte', DenunciaController.generarPdf);

  api.get('/distrito/denuncia/:idDenuncia/adjunto', DenunciaController.obtenerAdjunto);

  api.get('/distrito/denuncia/:idDenuncia/detalle', DenunciaController.obtenerDenuncia);

  api.get('/distrito/denuncia', DenunciaController.buscarPorNumeroDocumento);

  api.get('/distrito/denuncia/:idDenuncia/victima', DenunciaController.buscarVictimaHistorial);

  api.get('/distrito/denuncia/:idDenuncia/denunciado', DenunciaController.buscarDenunciadoHistorial);

  api.get('/persona', DenunciaController.buscarPersona);

  api.post('/distrito/denuncia/:idDenuncia/profesional', DenunciaController.asignarProfesional);

  api.patch('/distrito/denuncia/:idDenuncia/estado', DenunciaController.actualizarEstadoDenuncia);

  api.get('/distrito/denuncia/reporte/detalle-slim', DenunciaController.generarReporteDetalle);

  api.get('/distrito/denuncia/reporte/estadistico', DenunciaController.generarReporteEstadistico);

  api.get('/distrito/denuncia/reporte/general', DenunciaController.generarReporteGeneral);

  //api para listar asignados
  api.get('/distrito/instrumento/asignado', UsuarioCasoController.listarAsignados);

  //api para listar casos en seguimiento
  api.get('/distrito/instrumento/seguimiento', UsuarioCasoController.listarSeguimiento);

  //api para el dashboard
  api.get('/distrito/dashboard', UsuarioCasoController.resumenDistrito);

  api.post('/distrito/denuncia/:idDenuncia/transferencia', DenunciaController.crearTransferencia);

  // listado con criterios de Asistencia Familiar
  api.get('/distrito/denuncia/asistencia', DenunciaController.listarParaAsistencia);

  // informacion cantidad de denuncias por año y tipologias
  api.get('/distrito/denuncia/:idDistrito/cuadroinformativo', DenunciaController.cuadroInformativo);

  // reporte por regiones
  api.get('/distrito/denuncia/reporte/region', DenunciaController.generarReporteRegion);

  return api;
};
