const { ErrorApp } = require('../../lib/error');
const { escribirBase64 } = require('../../lib/file');
const { config } = require('../../../common');
const fs = require('fs');
const util = require('util');
const dayjs = require('dayjs');
const readFile = util.promisify(fs.readFile);
const { json2Csv } = require('../../lib/file');

module.exports = function terapiaService (repositories) {
  const {
    TerapiaSlimRepository, TerapiaExternaRepository, CertificadoMedicoRepository,
    CitacionRepository, NotaExternaRepository, RequerimientoFiscalRepository, OrientacionRepository, DenunciaRepository,
    UsuarioRepository, RolRepository
  } = repositories;

  async function verificarDenuncia (idDenuncia) {
    const existeDenuncia = await DenunciaRepository.buscarPorId(idDenuncia);
    if (!existeDenuncia) {
      throw new Error('No existe la denuncia');
    }
  }

  async function crearTerapiaSlim (idDenuncia, data) {
    try {
      await verificarDenuncia(idDenuncia);
      data.idDenuncia = idDenuncia;
      const resultado = await TerapiaSlimRepository.createOrUpdate(data);
      return resultado;
    } catch (error) {
      throw new ErrorApp(error.message, 400);
    }
  }

  async function obtenerTerapiaSlim (id) {
    try {
      const resultado = await TerapiaSlimRepository.findById(id);
      return resultado;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function listarTerapiasSlim (idDenuncia) {
    try {
      const terapiasSlim = await TerapiaSlimRepository.listar(idDenuncia);

      return terapiasSlim;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function crearTerapiaExterna (idDenuncia, data) {
    try {
      const { documento } = data;
      await verificarDenuncia(idDenuncia);
      data.idDenuncia = idDenuncia;

      if (documento) {
        // guardar documento
        const nombreArchivo = `terapia-externa-${Date.now()}.pdf`;

        const ruta = await escribirBase64(`${config.app.raizDocumentos}/docs-terapia-externa`, nombreArchivo, documento);
        delete data.documento;
        data.rutaDocumento = ruta;
        const resultado = await TerapiaExternaRepository.createOrUpdate(data);
        return resultado;
      } else {
        throw new Error('El documento adjunto es obligatorio');
      }
    } catch (error) {
      throw new ErrorApp(error.message, 400);
    }
  }

  async function obtenerTerapiaExterna (id) {
    try {
      const resultado = await TerapiaExternaRepository.findById(id);
      return resultado;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function listarTerapiasExternas (idDenuncia) {
    try {
      const terapiasSlim = await TerapiaExternaRepository.listar(idDenuncia);

      return terapiasSlim;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function obtenerAdjunto (idInstrumento) {
    try {
      const resultado = await TerapiaExternaRepository.findById(idInstrumento);
      if (resultado && resultado.rutaDocumento) {
        const rutaDocumento = resultado.rutaDocumento;
        const doc = await readFile(rutaDocumento);
        return doc;
      } else {
        throw new Error('no existe el adjunto para el instrumento');
      }
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function crearCertificadoMedico (idDenuncia, data) {
    try {
      const { documento } = data;
      await verificarDenuncia(idDenuncia);
      data.idDenuncia = idDenuncia;

      if (documento) {
        // guardar documento
        const nombreArchivo = `certificado-medico-${Date.now()}.pdf`;
        const ruta = await escribirBase64(`${config.app.raizDocumentos}/docs-terapia-externa`, nombreArchivo, documento);
        delete data.documento;
        data.rutaDocumento = ruta;
        const resultado = await CertificadoMedicoRepository.createOrUpdate(data);
        return resultado;
      } else {
        throw new Error('El documento adjunto es obligatorio');
      }
    } catch (error) {
      throw new ErrorApp(error.message, 400);
    }
  }

  async function obtenerCertificadoMedico (id) {
    try {
      const resultado = await CertificadoMedicoRepository.findById(id);
      return resultado;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function listarCertificadosMedicos (idDenuncia) {
    try {
      const certiticadosMedicos = await CertificadoMedicoRepository.listar(idDenuncia);

      return certiticadosMedicos;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function obtenerAdjuntoCertificadoMedico (idInstrumento) {
    try {
      const resultado = await CertificadoMedicoRepository.findById(idInstrumento);
      if (resultado && resultado.rutaDocumento) {
        const rutaDocumento = resultado.rutaDocumento;
        const doc = await readFile(rutaDocumento);
        return doc;
      } else {
        throw new Error('no existe el adjunto para el instrumento');
      }
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function crearNotaExterna (idDenuncia, data) {
    try {
      const { documento } = data;
      await verificarDenuncia(idDenuncia);
      data.idDenuncia = idDenuncia;

      if (documento) {
        // guardar documento
        const nombreArchivo = `nota-externa-${Date.now()}.pdf`;
        const ruta = await escribirBase64(`${config.app.raizDocumentos}/docs-terapia-externa`, nombreArchivo, documento);
        delete data.documento;
        data.rutaDocumento = ruta;
        const resultado = await NotaExternaRepository.createOrUpdate(data);
        return resultado;
      } else {
        throw new Error('El documento adjunto es obligatorio');
      }
    } catch (error) {
      throw new ErrorApp(error.message, 400);
    }
  }

  async function obtenerNotaExterna (id) {
    try {
      const resultado = await NotaExternaRepository.findById(id);
      return resultado;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function listarNotasExternas (idDenuncia) {
    try {
      const notasExternas = await NotaExternaRepository.listar(idDenuncia);

      return notasExternas;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function obtenerAdjuntoNotaExterna (idInstrumento) {
    try {
      const resultado = await NotaExternaRepository.findById(idInstrumento);
      if (resultado && resultado.rutaDocumento) {
        const rutaDocumento = resultado.rutaDocumento;
        const doc = await readFile(rutaDocumento);
        return doc;
      } else {
        throw new Error('no existe el adjunto para el instrumento');
      }
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function crearCitacion (idDenuncia, data) {
    try {
      await verificarDenuncia(idDenuncia);
      data.idDenuncia = idDenuncia;

      const resultado = await CitacionRepository.createOrUpdate(data);
      return resultado;
    } catch (error) {
      throw new ErrorApp(error.message, 400);
    }
  }

  async function obtenerCitacion (id) {
    try {
      const resultado = await CitacionRepository.findById(id);
      return resultado;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function listarCitaciones (idDenuncia) {
    try {
      const citaciones = await CitacionRepository.listar(idDenuncia);

      return citaciones;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  // async function crearRequerimientoFiscal (datosUsuario, data) {
  //   try {
  //     const { documento } = data;
  //     const idDistrito = await validarRol(datosUsuario);
  //     if (idDistrito) {
  //       data.idDistrito = idDistrito;
  //     } else {
  //       throw new Error('El rol no tiene permisos para realizar esta accion.');
  //     }
  //     if (documento) {
  //       // guardar documento
  //       const nombreArchivo = `requerimiento-fiscal-${Date.now()}.pdf`;
  //       const ruta = await escribirBase64(`${config.app.raizDocumentos}/docs-req-fiscal`, nombreArchivo, documento);
  //       delete data.documento;
  //       data.rutaDocumento = ruta;
  //       data.fecha = dayjs().format('DD/MM/YYYY');
  //       data.accionSeguimiento = 'sin datos';
  //       const resultado = await RequerimientoFiscalRepository.createOrUpdate(data);
  //       return resultado;
  //     } else {
  //       throw new Error('El documento adjunto es obligatorio');
  //     }
  //   } catch (error) {
  //     throw new ErrorApp(error.message, 400);
  //   }
  // }

  // async function obtenerRequerimientoFiscal (id) {
  //   try {
  //     const resultado = await RequerimientoFiscalRepository.findById(id);
  //     return resultado;
  //   } catch (err) {
  //     throw new ErrorApp(err.message, 400);
  //   }
  // }

  // async function listarRequerimientosFiscales (datosUsuario) {
  //   try {
  //     const params = await obtenerFiltroRol(datosUsuario);
  //     const requerimientosFiscales = await RequerimientoFiscalRepository.listar(params);

  //     return requerimientosFiscales;
  //   } catch (err) {
  //     throw new ErrorApp(err.message, 400);
  //   }
  // }

  // async function obtenerAdjuntoRequerimientoFiscal (idRequerimientoFiscal) {
  //   try {
  //     const resultado = await RequerimientoFiscalRepository.findById(idRequerimientoFiscal);
  //     if (resultado && resultado.rutaDocumento) {
  //       const rutaDocumento = resultado.rutaDocumento;
  //       const doc = await readFile(rutaDocumento);
  //       return doc;
  //     } else {
  //       throw new Error('no existe el adjunto para el requerimiento fiscal');
  //     }
  //   } catch (err) {
  //     throw new ErrorApp(err.message, 400);
  //   }
  // }

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

  return {
    crearTerapiaSlim,
    obtenerTerapiaSlim,
    listarTerapiasSlim,
    crearTerapiaExterna,
    obtenerTerapiaExterna,
    listarTerapiasExternas,
    obtenerAdjunto,
    crearCertificadoMedico,
    obtenerCertificadoMedico,
    listarCertificadosMedicos,
    obtenerAdjuntoCertificadoMedico,
    crearNotaExterna,
    obtenerNotaExterna,
    listarNotasExternas,
    obtenerAdjuntoNotaExterna,
    crearCitacion,
    obtenerCitacion,
    listarCitaciones,
    // crearRequerimientoFiscal,
    // obtenerRequerimientoFiscal,
    // listarRequerimientosFiscales,
    // obtenerAdjuntoRequerimientoFiscal
  };
};
