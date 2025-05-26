const { ErrorApp } = require('../../lib/error');
const { escribirBase64, json2Csv } = require('../../lib/file');
const { config } = require('../../../common');
const fs = require('fs');
const util = require('util');
const dayjs = require('dayjs');
const readFile = util.promisify(fs.readFile);
const { makePdf } = require('../../../common/lib/pdf');

module.exports = function requerimientoService (repositories) {
  const {
    RequerimientoRepository, UsuarioRepository, RolRepository, DistritoRepository
  } = repositories;

  async function crear (datosUsuario, data) {
    try {
      const idDistrito = await validarRol(datosUsuario);
      if (idDistrito) {
        data.idDistrito = idDistrito;
      } else {
        throw new Error('El rol no tiene permisos para realizar esta accion.');
      }

      if (data.documento) {
        // guardar documento
        const rutaDocumento = await guardarArchivo(config.app.raizRequerimientos, 'requerimiento-fiscal', data.documento)
        delete data.documento;
        data.rutaDocumento = rutaDocumento;
        data.fecha = dayjs().format('DD/MM/YYYY');
        const resultado = await RequerimientoRepository.createOrUpdate(data);
        return resultado;
      } else {
        throw new Error('El documento adjunto es obligatorio');
      }
    } catch (error) {
      throw new ErrorApp(error.message, 400);
    }
  }

  async function obtener (id) {
    try {
      const resultado = await RequerimientoRepository.findById(id);
      return resultado;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function listar (datosUsuario, params) {
    try {
      const filtros = await obtenerFiltroRol(datosUsuario);
      params = {...filtros, ...params}
      const requerimientos = await RequerimientoRepository.listar(params);

      return requerimientos;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function obtenerAdjunto (id) {
    try {
      const resultado = await RequerimientoRepository.findById(id);
      if (resultado && resultado.rutaDocumento) {
        const rutaDocumento = resultado.rutaDocumento;
        const doc = await readFile(rutaDocumento);
        return doc;
      } else {
        throw new Error('No existe el adjunto para el requerimiento');
      }
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function validarRol (datosUsuario) {
    const [idRol] = datosUsuario.idRoles;
    const idUsuario = datosUsuario.idUsuario;
    const usuario = await UsuarioRepository.findById(idUsuario);

    const existeRol = await RolRepository.findById(idRol);
    if (existeRol && ['ABOGADO', 'PSICOLOGO', 'TRABAJADOR_SOCIAL'].indexOf(existeRol.nombre) >= 0) {
      return usuario.idDistrito;
    }
    return null;
  }

  async function obtenerFiltroRol (datosUsuario) {
    const [idRol] = datosUsuario.idRoles;
    const idUsuario = datosUsuario.idUsuario;
    const usuario = await UsuarioRepository.findById(idUsuario);
    const params = {};
    const existeRol = await RolRepository.findById(idRol);
    if (existeRol) {
      if (existeRol.nombre === 'SUPERVISOR_DEPARTAMENTAL') {
        params.codDepartamento = usuario.codDepartamento;
      }
      if (['SUPERVISOR_MUNICIPAL', 'ADMINISTRADOR_MUNICIPAL'].indexOf(existeRol.nombre) >= 0) {
        params.idMunicipio = usuario.idMunicipio;
      }

      if (['ABOGADO', 'PSICOLOGO', 'TRABAJADOR_SOCIAL'].indexOf(existeRol.nombre) >= 0) {
        params.idDistrito = usuario.idDistrito;
      }
    } else {
      throw new Error('No tiene permisos para realizar esta accion');
    }
    return params;
  }

  async function guardarArchivo (nombreDirectorio, prefijoArchivo, documento) {
    const extension = documento.split(';')[0].split('/')[1] || 'pdf';
    const nombreArchivo = `${prefijoArchivo}-${Date.now()}.${extension}`;
    const ruta = await escribirBase64(nombreDirectorio, nombreArchivo, documento);
    return ruta;
  }

  async function obtenerDocumento (id) {
    try {
      const resultado = await RequerimientoRepository.findById(id);
      const distrito = await DistritoRepository.findById(resultado.idDistrito)
      const nombreDistrito = distrito.nombre
      const file = await makePdf('requerimiento.html', {...resultado, nombreDistrito })
      return file
    } catch (error) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function reporteFechas(datosUsuario, params) {
    try {
      console.log('reporte', params);
      const filtroRol = await obtenerFiltroRol(datosUsuario);
      console.log(datosUsuario, filtroRol)
      const requerimientos = await RequerimientoRepository.listar({...filtroRol, ...params})
      return json2Csv(requerimientos.rows)
    } catch (error) {
      throw new ErrorApp(error.message, 400);
    }
  }


  return {
    crear,
    obtener,
    listar,
    obtenerAdjunto,
    obtenerDocumento,
    reporteFechas
  };
};
