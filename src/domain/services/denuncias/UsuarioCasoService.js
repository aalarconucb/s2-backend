const { ErrorApp } = require('../../lib/error');

module.exports = function usuarioCasoService (repositories) {
  const { UsuarioCasoRepository } = repositories;
  const InstrumentoService = require('../../services/app/InstrumentoService')(repositories)
  const DenunciaService = require('../../services/app/DenunciaService')(repositories)
  const SolicitudAtencionService = require('../../services/app/SolicitudAtencionService')(repositories)

  async function listarAsignados (idUsuario) {
    try {
      const casos = await UsuarioCasoRepository.listarAsignados(idUsuario);
      const asignados = []
      try {
        const instrumentosPromesas = casos.map(caso => InstrumentoService.obtenerInstrumentos(caso.id));
        const resultados = await Promise.all(instrumentosPromesas);
        resultados.forEach((instrumentos, index) => {
          if (instrumentos.length === 0) {
            asignados.push(casos[index]);
          }
        });
      } catch (error) {
        console.error("Error al obtener instrumentos:", error);
      }
      return asignados.map((item) => ({
        ...item,
        diferencia: Math.abs(new Date() - formatearFecha(item.usuario[0].usuario_caso.createdAt)) / 36e5
      }));
    } catch (error) {
      throw new ErrorApp(error.message, 400);
    }
  }

  async function listarSeguimiento (idUsuario) {
    try {
      const casos = await UsuarioCasoRepository.listarAsignados(idUsuario);
      const seguimiento = []
      try {
        const instrumentosPromesas = casos.map(caso => InstrumentoService.obtenerInstrumentos(caso.id));
        const resultados = await Promise.all(instrumentosPromesas);
        resultados.forEach((instrumentos, index) => {
          if (instrumentos.length !== 0) {
            seguimiento.push(casos[index]);
          }
        });
      } catch (error) {
        console.error("Error al obtener instrumentos:", error);
      }
      return seguimiento.map((item) => ({
        ...item,
        diferencia: Math.abs(new Date() - formatearFecha(item.usuario[0].usuario_caso.createdAt)) / 36e5
      }));
    } catch (error) {
      throw new ErrorApp(error.message, 400);
    }
  }

  // async function listarSeguimiento (idUsuario) {
  //   try {
  //     const casos = await UsuarioCasoRepository.listarSeguimiento(idUsuario);
  //     console.log(casos);
  //     return casos.map((item) => ({
  //       ...item,
  //       diferencia: Math.abs(new Date() - formatearFecha(item.usuario[0].usuario_caso.createdAt)) / 36e5
  //     }));
  //   } catch (error) {
  //     throw new ErrorApp(error.message, 400);
  //   }
  // }

  function formatearFecha (dateTimeString) {
    const [dateString, timeString] = dateTimeString.split(' ');
    const [day, month, year] = dateString.split('/');
    const [hour, minute, second] = timeString.split(':');

    const dateObj = new Date(+year, +month - 1, +day, +hour, +minute, +second);
    return dateObj;
  }

  async function resumenDistrito (datosUsuario) {
    try {
      const denunciasPorUsuario = await DenunciaService.listarDenunciasPorUsuario(datosUsuario, {})
      const registrados = denunciasPorUsuario.count

      const denunciasAsignadas = await listarAsignados(datosUsuario.idUsuario)
      const asignados = denunciasAsignadas.length

      const denunciasSeguimiento = await listarSeguimiento(datosUsuario.idUsuario)
      const seguimiento = denunciasSeguimiento.length

      const denunciasExternas = await SolicitudAtencionService.listar(datosUsuario)
      const externo = denunciasExternas.count

      return {
        registrados,
        asignados,
        seguimiento,
        externo
      }

    } catch (error) {
      console.error('Error en resumenDistrito:', error)
    }
  }

  return {
    listarAsignados,
    listarSeguimiento,
    resumenDistrito
  };
};
