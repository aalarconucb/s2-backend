import { DenunciaRegistrada } from '../events/DenunciaRegistrada.js';
import { DenunciaAsignadaAUsuario } from '../events/DenunciaAsignadaAUsuario.js';
import { DenunciaFinalizada } from '../events/DenunciaFinalizada.js';

// Aggregate Root del módulo de Denuncias
export class Denuncia {
  constructor({ id, codigoRuv, victima, denunciado, hecho, denunciante, estado = 'REGISTRADO', fechaRegistro = new Date() }) {
    // Identificador de la denuncia
    this.id = id;

    // Código único de la denuncia generado
    this.codigoRuv = codigoRuv;

    // Entidades internas del agregado
    this.victima = victima;
    this.denunciado = denunciado;
    this.hecho = hecho;
    this.denunciante = denunciante;

    // Estado de la denuncia: REGISTRADO, ASIGNADO, FINALIZADO
    this.estado = estado;
    this.fechaRegistro = fechaRegistro;

    this._validarEstado();
  }

  // Método estatico para generar una denuncia nueva
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

    // Generacion del evento de dominio correspondiente
    denuncia.evento = new DenunciaRegistrada({
      id: denuncia.id,
      codigoRuv: denuncia.codigoRuv,
      fecha: denuncia.fechaRegistro
    });

    return denuncia;
  }

  // Método del dominio para asignar la denuncia a un usuario
  asignarAUsuario(idUsuario) {
    if (this.estado !== 'REGISTRADO') {
      throw new Error("Solo se puede asignar una denuncia que esté en estado 'REGISTRADO'.");
    }

    this.estado = 'ASIGNADO';

    // Evento de dominio que refleja el cambio de estado
    this.evento = new DenunciaAsignadaAUsuario({
      idDenuncia: this.id,
      idUsuarioAsignado: idUsuario,
      fecha: new Date()
    });
  }

  // Método para finalizar una denuncia con lógica de validación
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

  // Método para cambiar el estado de una denuncia
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
  
  // Método interno para validar el estado inicial
  _validarEstado() {
    if (!this.estado) {
      throw new Error("Estado de denuncia requerido.");
    }
  }
}
