const { ErrorApp } = require('../../lib/error');
const { config } = require('../../../common');
const { escribirBase64 } = require('../../lib/file');
const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);

module.exports = function municipioService (repositories) {
  const { MunicipioRepository, UsuarioRepository, UsuarioCasoRepository } = repositories;

  function guardarArchivo (nombreDirectorio, prefijoArchivo, logo) {
    const extension = logo.split(';')[0].split('/')[1] || 'png';
    const nombreArchivo = `${prefijoArchivo}-${Date.now()}.${extension}`;
    const ruta = escribirBase64(nombreDirectorio, nombreArchivo, logo);
    return ruta;
  }

  async function createOrUpdate (data) {
    try {
      const  { codigoMunicipio } = data;
      const existeMunicipio = await MunicipioRepository.buscarPorCodigoMunicipio(codigoMunicipio);
      if (existeMunicipio) {
        throw new Error(`Ya existe un municipio creado para ${existeMunicipio.codigoMunicipio}`);
      }
      if (data.logo) {
        const rutaLogo = guardarArchivo(config.app.raizDenuncias, 'logo', data.logo);
        data.rutaLogo = rutaLogo;
      }
      const municipio = await MunicipioRepository.createOrUpdate(data);
      return municipio;
    } catch (error) {
      throw new ErrorApp(error.message, 400);
    }
  }

  async function actualizar (id, data) {
    try {
      const existeMunicipio = await obtenerMunicipio(id)
      if (!existeMunicipio) {
        throw new Error(`No existe el municipio para actualizar.`);
      }

      data.id = id
      const municipio = await MunicipioRepository.createOrUpdate(data);
      return municipio;
    } catch (error) {
      throw new ErrorApp(error.message, 400);
    }
  }

  async function obtenerMunicipios (codigoProvincia) {
    try {
      return MunicipioRepository.obtenerMunicipios(codigoProvincia);
    } catch (error) {
      throw new ErrorApp(error.message, 400);
    }
  }

  async function obtenerMunicipiosPorRed (idRed) {
    try {
      return MunicipioRepository.obtenerMunicipiosPorRed(idRed);
    } catch (error) {
      throw new ErrorApp(error.message, 400);
    }
  }

  async function obtenerDistritos (idMunicipio) {
    try {
      return MunicipioRepository.obtenerDistritos(idMunicipio);
    } catch (error) {
      throw new ErrorApp(error.message, 400);
    }
  }

  async function obtenerProfesionales (idDistrito) {
    try {
      const profesionales = await UsuarioRepository.obtenerProfesionalesPorDistrito(idDistrito);

      for (const profesional of profesionales) {
        const nroCasos = await UsuarioCasoRepository.contarAsignados(profesional.id);
        profesional.nroCasos = nroCasos;
      }

      return profesionales;
    } catch (error) {
      throw new ErrorApp(error.message, 400);
    }
  }

  async function obtenerUsuarios (params) {
    try {
      const denunciados = await UsuarioRepository.obtenerUsuariosMunicipios(params);
      return denunciados;
    } catch (error) {
      throw new ErrorApp(error.message, 400);
    }
  }

  async function obtenerLogo (idMunicipio) {
    try {
      const resultado = await MunicipioRepository.findById(idMunicipio);
      if (resultado && resultado.rutaLogo) {
        const rutaLogo = resultado.rutaLogo;
        const logo = await readFile(rutaLogo);
        return logo;
      } else {
        throw new Error('no existe el logo para el municipio');
      }
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function obtenerMunicipio (idMunicipio) {
    try {
      const resultado = await MunicipioRepository.findById(idMunicipio);
      if (resultado) {
        return resultado;
      } else {
        throw new Error('no existe el municipio');
      }
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function listar (params = {}) {
    try {
      return MunicipioRepository.listar(params);
    } catch (error) {
      throw new ErrorApp(error.message, 400);
    }
  }

  async function obtenerMunicipiosPorDepartamento (codigoDepartamento) {
    try {
      return MunicipioRepository.obtenerMunicipiosPorDepartamento(codigoDepartamento);
    } catch (error) {
      throw new ErrorApp(error.message, 400);
    }
  }


  return {
    createOrUpdate,
    actualizar,
    obtenerMunicipios,
    obtenerMunicipiosPorRed,
    obtenerDistritos,
    obtenerProfesionales,
    obtenerUsuarios,
    obtenerLogo,
    obtenerMunicipio,
    listar,
    obtenerMunicipiosPorDepartamento
  };
};
