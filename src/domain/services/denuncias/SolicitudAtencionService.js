const { ErrorApp } = require('../../lib/error');

module.exports = function solicitudAtencionService (repositories) {
  const { SolicitudAtencionRepository, RolRepository, UsuarioRepository } = repositories;
  async function crear (idDenuncia, data) {
    try {
      data.idDenuncia = idDenuncia;
      if (data.profesional && data.idDistrito) {
        data.respuesta = 'sin respuesta';
        const solicitudAtencion = await SolicitudAtencionRepository.createOrUpdate(data);
        return solicitudAtencion;
      } else {
        throw new Error('Es necesario elegir el profesional y el Slim');
      }
    } catch (error) {
      throw new ErrorApp(error.message, 400);
    }
  }

  async function obtenerSolicitudesPorDenuncia (idDenuncia) {
    try {
      const solicitudesAtencion = await SolicitudAtencionRepository.obtenerSolicitudesPorDenuncia(idDenuncia);

      return solicitudesAtencion;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function listar (datosUsuario) {
    try {
      const [idRol] = datosUsuario.idRoles;
      const existeRol = await RolRepository.findById(idRol);
      const { idUsuario } = datosUsuario;
      const usuario = await UsuarioRepository.findById(idUsuario);
      const params = {};
      if (existeRol && ['ABOGADO', 'PSICOLOGO', 'TRABAJADOR_SOCIAL'].indexOf(existeRol.nombre) >= 0) {
        // params.codDepartamento = usuario.codDepartamento;
        params.usuarioId = usuario.id;
      } else {
        throw new Error('No tiene permisos para realizar esta accion.');
      }
      const solicitudesAtencion = await SolicitudAtencionRepository.listar(params);
      console.log("🚀 ~ listar ~ solicitudesAtencion :", solicitudesAtencion )

      return solicitudesAtencion;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  return {
    crear,
    obtenerSolicitudesPorDenuncia,
    listar
  };
};
