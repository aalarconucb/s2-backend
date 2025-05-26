'use strict';

module.exports = function setupMunicipio (api, controllers, middlewares) {
  const { MunicipioController, DistritoController } = controllers;

  api.post('/municipio', MunicipioController.crear);

  // api.post('/municipio/:idMunicipio/distrito', DistritoController.crear);

  api.get('/municipio/:idMunicipio/logo', MunicipioController.obtenerLogo);

  api.get('/municipio/usuario', MunicipioController.obtenerUsuarios);

  api.get('/provincia/:codigoProvincia/municipio', MunicipioController.obtenerMunicipios);

  api.get('/red/:idRed/municipio', MunicipioController.obtenerMunicipiosPorRed);

  api.get('/provincia/municipio/:idMunicipio/distrito', MunicipioController.obtenerDistritos);

  api.get('/municipio/distrito/:idDistrito/profesional', MunicipioController.obtenerProfesionales);

  // api.patch('/municipio/distrito/:idDistrito', DistritoController.actualizar);

  // api.get('/municipio/distrito/:idDistrito', DistritoController.obtenerInformacionDistrito);

  // api.get('/distrito/reporte/informacion', DistritoController.obtenerReporte);

  //documentar
  api.get('/municipio/obtener/:idMunicipio', MunicipioController.obtenerMunicipio);

  api.get('/municipio/listar', MunicipioController.listar);

  api.patch('/municipio/:id', MunicipioController.actualizar);

  api.get('/municipio/:codigoDepartamento/departamento', MunicipioController.obtenerMunicipiosPorDepartamento);

  return api;
};
