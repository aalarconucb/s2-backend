const { ErrorApp } = require('../../lib/error');
const { json2Csv } = require('../../lib/file');
const { makePdf } = require('../../../common/lib/pdf');

module.exports = function orientacionService (repositories) {
  const {
    OrientacionRepository, UsuarioRepository, RolRepository, DistritoRepository
  } = repositories;

  async function crearOrientacion (datosUsuario, data) {
    try {
      const idDistrito = await validarRol(datosUsuario);
      if (idDistrito) {
        data.idDistrito = idDistrito;
      } else {
        throw new Error('El rol no tiene permisos para realizar esta accion.');
      }

      const distrito = await DistritoRepository.buscarDpaDistrito(idDistrito);

      const { codigoMunicipio } = distrito.municipioDistrito;
      const siglaMunicipio = distrito.municipioDistrito.dpaMunicipio.sigla;
      const { codigo, secuencial } = await generarCodigoOrientacion(codigoMunicipio, siglaMunicipio);

      data.nroOrientacion = codigo
      data.secuencial = secuencial
      const resultado = await OrientacionRepository.createOrUpdate(data);
      return resultado;
    } catch (error) {
      throw new ErrorApp(error.message, 400);
    }
  }

  async function obtenerOrientacion (id) {
    try {
      const resultado = await OrientacionRepository.findById(id);
      return resultado;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function listarOrientaciones (datosUsuario, params) {
    try {
      const filtros = await obtenerFiltroRol(datosUsuario);
      params = {...filtros, ...params}
      const orientaciones = await OrientacionRepository.listar(params);

      return orientaciones;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function obtenerReporteOrientaciones (datosUsuario, params) {
    try {
      console.log('reporte', params);
      const filtroRol = await obtenerFiltroRol(datosUsuario);
      console.log(datosUsuario, filtroRol);
      const orientaciones = await OrientacionRepository.listar({ ...filtroRol, ...params });
      return json2Csv(orientaciones.rows);
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

  async function generarCodigoOrientacion (codigoMunicipio, siglaMunicipio) {
    const departamentos = {
      '01' : 'CH',
      '02' : 'LP',
      '03' : 'CB',
      '04' : 'OR',
      '05' : 'PT',
      '06' : 'TJ',
      '07' : 'SC',
      '08' : 'BN',
      '09' : 'PD'
    };

    const codDepartamento = codigoMunicipio.substr(0, 2);
    const anio =  new Date().getFullYear();
    const gestion = anio;
    const [secuencialDepartamento] = await OrientacionRepository.obtenerSecuencial(anio);

    const secuencial = secuencialDepartamento && secuencialDepartamento.max ? secuencialDepartamento.max + 1 : 1;
    const codigo = `${departamentos[codDepartamento]}-${siglaMunicipio}-ORI-${secuencial.toString().padStart(6, 0)}-${gestion}`;

    return { codigo, secuencial };
  }

  async function generarPdf (id) {
    try {
      const resultado = await OrientacionRepository.findById(id);
      const distrito = await DistritoRepository.findById(resultado.idDistrito)
      const nombreDistrito = distrito.nombre
      const file = await makePdf('orientacion.html', {...resultado, nombreDistrito })
      return file
    } catch (error) {
      throw new ErrorApp(err.message, 400);
    }
  }

  return {
    crearOrientacion,
    obtenerOrientacion,
    listarOrientaciones,
    obtenerReporteOrientaciones,
    generarCodigoOrientacion,
    generarPdf
  };
};
