'use strict';

module.exports = function setupDistrito (api, controllers, middlewares) {
  const { DistritoController } = controllers;

  /* Endpoints para la gestion de Distritos o SLIM */

  api.post('/municipio/:idMunicipio/distrito', DistritoController.crear);

  api.patch('/municipio/distrito/:idDistrito', DistritoController.actualizar);

  api.get('/municipio/distrito/:idDistrito', DistritoController.obtenerInformacionDistrito);

  api.get('/distrito/reporte/informacion', DistritoController.obtenerReporte);

  /* documentar */
  api.get('/distrito/listar', DistritoController.listar);

  return api;
};
