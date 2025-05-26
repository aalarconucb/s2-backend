const { ErrorApp } = require('../../lib/error');
const { json2Csv } = require('../../lib/file');

module.exports = function distritoService (repositories) {
  const { DistritoRepository, MunicipioRepository } = repositories;
  async function createOrUpdate (idMunicipio, data) {
    try {
      const existeMunicipio = await MunicipioRepository.findById(idMunicipio);
      if (!existeMunicipio) {
        throw new Error('No existe el municipio al que quiere asignar el distrito');
      }
      data.idMunicipio = idMunicipio;
      const distrito = await DistritoRepository.createOrUpdate(data);
      return distrito;
    } catch (error) {
      throw new ErrorApp(error.message, 400);
    }
  }

  async function actualizar (idDistrito, data) {
    try {
      data.id = idDistrito;
      const distrito = await DistritoRepository.createOrUpdate(data);
      return distrito;
    } catch (error) {
      throw new ErrorApp(error.message, 400);
    }
  }

  async function obtenerInformacionDistrito (idDistrito) {
    try {
      const resultado = await DistritoRepository.findById(idDistrito);
      const dpa = await DistritoRepository.buscarDpaDistrito(idDistrito)
      resultado.municipioDistrito = dpa.municipioDistrito
      return resultado;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function obtenerReporte (params, datosUsuario, tipo) {
    try {
      const resultados = await DistritoRepository.obtenerReporte();
      return json2Csv(resultados);
    } catch (error) {
      throw new ErrorApp(error.message, 400);
    }
  }

  async function listar (params = {}) {
    try {
      const distritos = await DistritoRepository.listar(params);
      return distritos;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  return {
    createOrUpdate,
    actualizar,
    obtenerInformacionDistrito,
    obtenerReporte,
    listar
  };
};
