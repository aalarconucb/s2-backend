const { ErrorApp } = require('../../lib/error');
const { escribirBase64 } = require('../../lib/file');
const { config } = require('../../../common');
const dayjs = require('dayjs');
const { makePdf } = require('../../../common/lib/pdf');
const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);

module.exports = function referenciaService (repositories) {
  const { FichaReferenciaRepository, FichaContrareferenciaRepository, DenunciaRepository } = repositories;

  function guardarArchivo (nombreDirectorio, prefijoArchivo, documento) {
    const nombreArchivo = `${prefijoArchivo}-${Date.now()}.pdf`;
    const ruta = escribirBase64(nombreDirectorio, nombreArchivo, documento);
    return ruta;
  }

  async function crearReferencia (idDenuncia, data) {
    try {
      data.idDenuncia = idDenuncia;
      if (data.documento) {
        const rutaDocumento = guardarArchivo(config.app.raizDocumentos, 'ficha-referencia', data.documento);
        data.rutaDocumento = rutaDocumento;
      }
      data.fecha = dayjs().format('DD/MM/YYYY');
      const solicitudAtencion = await FichaReferenciaRepository.createOrUpdate(data);
      return solicitudAtencion;
    } catch (error) {
      throw new ErrorApp(error.message, 400);
    }
  }

  async function listarReferencias (idDenuncia) {
    try {
      const terapiasSlim = await FichaReferenciaRepository.listar(idDenuncia);

      return terapiasSlim;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function generarPdfReferencia (idFichaReferencia) {
    try {
      const fichaReferencia = await FichaReferenciaRepository.findById(idFichaReferencia);
      console.log(fichaReferencia);
      const victima = await DenunciaRepository.obtenerDetalleVictima(fichaReferencia.idDenuncia);
      console.log(victima);
      const denuncia = await DenunciaRepository.obtenerDetalleDenuncia(fichaReferencia.idDenuncia);
      console.log(denuncia);
      const file = await makePdf('ficha-referencia.html', { ...fichaReferencia, victima, denuncia });

      return file;
    } catch (error) {
      throw new ErrorApp(error.message, 400);
    }
  }

  async function crearContraReferencia (idDenuncia, data) {
    try {
      data.idDenuncia = idDenuncia;
      if (data.documento) {
        const rutaDocumento = guardarArchivo(config.app.raizDocumentos, 'ficha-contra-referencia', data.documento);
        data.rutaDocumento = rutaDocumento;
      }
      data.fecha = dayjs().format('DD/MM/YYYY');
      const solicitudAtencion = await FichaContrareferenciaRepository.createOrUpdate(data);
      return solicitudAtencion;
    } catch (error) {
      throw new ErrorApp(error.message, 400);
    }
  }

  async function listarContraReferencias (idDenuncia) {
    try {
      const terapiasSlim = await FichaContrareferenciaRepository.listar(idDenuncia);

      return terapiasSlim;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function generarPdfContraReferencia (idFichaContraReferencia) {
    try {
      const fichaContraReferencia = await FichaContrareferenciaRepository.findById(idFichaContraReferencia);

      const file = await makePdf('ficha-contra-referencia.html', { ...fichaContraReferencia });

      return file;
    } catch (error) {
      throw new ErrorApp(error.message, 400);
    }
  }

  async function obtenerReferencia (idFichaReferencia) {
    try {
      const fichaReferencia = await FichaReferenciaRepository.findById(idFichaReferencia);

      return fichaReferencia;
    } catch (error) {
      throw new ErrorApp(error.message, 400);
    }
  }

  async function obtenerContraReferencia (idFichaContraReferencia) {
    try {
      const fichaContraReferencia = await FichaContrareferenciaRepository.findById(idFichaContraReferencia);

      return fichaContraReferencia;
    } catch (error) {
      throw new ErrorApp(error.message, 400);
    }
  }

  async function obtenerAdjuntoContraReferencia (idFichaContraReferencia) {
    try {
      const resultado = await FichaContrareferenciaRepository.findById(idFichaContraReferencia);
      if (resultado && resultado.rutaDocumento) {
        const rutaDocumento = resultado.rutaDocumento;
        const doc = await readFile(rutaDocumento);
        return doc;
      } else {
        throw new Error('no existe el adjunto para la ficha de contra referencia.');
      }
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  return {
    crearReferencia,
    listarReferencias,
    generarPdfReferencia,
    crearContraReferencia,
    listarContraReferencias,
    generarPdfContraReferencia,
    obtenerReferencia,
    obtenerContraReferencia,
    obtenerAdjuntoContraReferencia
  };
};
