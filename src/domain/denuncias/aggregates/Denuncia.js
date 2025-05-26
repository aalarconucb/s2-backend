import { DenunciaRegistrada } from '../events/DenunciaRegistrada.js';
import { DenunciaAsignadaAUsuario } from '../events/DenunciaAsignadaAUsuario.js';
import { DenunciaFinalizada } from '../events/DenunciaFinalizada.js';

export class Denuncia {
  constructor({ id, codigoRuv, victima, denunciado, hecho, denunciante, estado = 'REGISTRADO', fechaRegistro = new Date() }) {
    this.id = id;
    this.codigoRuv = codigoRuv;
    this.victima = victima;
    this.denunciado = denunciado;
    this.hecho = hecho;
    this.denunciante = denunciante;
    this.estado = estado;
    this.fechaRegistro = fechaRegistro;

    this._validarEstado();
  }

  static registrar({ victima, denunciado, hecho, denunciante, generadorCodigo, codigoMunicipio }) {
    const id = crypto.randomUUID();
    const codigoRuv = generadorCodigo.generar({ codigoMunicipio });

    const denuncia = new Denuncia({
      id,
      codigoRuv,
      victima,
      denunciado,
      hecho,
      denunciante
    });

    denuncia.evento = new DenunciaRegistrada({
      id: denuncia.id,
      codigoRuv: denuncia.codigoRuv,
      fecha: denuncia.fechaRegistro
    });

    return denuncia;
  }

  asignarAUsuario(idUsuario) {
    if (this.estado !== 'REGISTRADO') {
      throw new Error("Solo se puede asignar una denuncia que esté en estado 'REGISTRADO'.");
    }

    this.estado = 'ASIGNADO';
    this.evento = new DenunciaAsignadaAUsuario({
      idDenuncia: this.id,
      idUsuarioAsignado: idUsuario,
      fecha: new Date()
    });
  }

  finalizar() {
    if (!['ASIGNADO', 'SENTENCIA'].includes(this.estado)) {
      throw new Error("Solo se puede finalizar una denuncia que esté asignada o sentenciada.");
    }

    this.estado = 'FINALIZADO';
    this.evento = new DenunciaFinalizada({
      id: this.id,
      fechaFinalizacion: new Date()
    });
  }

  cambiarEstado(nuevoEstado) {
    const estadosPermitidos = [
      'REGISTRADO', 'ASIGNADO', 'FINALIZADO', 'SENTENCIA',
      'PRESCRIPCION', 'RECHAZO', 'ACTOS_CONCLUSIVOS', 'CAMBIO_PATROCINIO_LEGAL', 'INACTIVO'
    ];

    if (!estadosPermitidos.includes(nuevoEstado)) {
      throw new Error(`Estado inválido: ${nuevoEstado}`);
    }

    this.estado = nuevoEstado;
  }

  _validarEstado() {
    if (!this.estado) {
      throw new Error("Estado de denuncia requerido.");
    }
  }
}
