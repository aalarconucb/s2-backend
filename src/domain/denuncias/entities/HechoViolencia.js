// Entidad del dominio: HechoViolencia
// Representa una parte del agregado Denuncia, encapsulando datos específicos y posibles comportamientos futuros

export class HechoViolencia {
  constructor({ relacion, direccion, fecha, hora }) {
    if (!relacion || typeof relacion !== 'string' || relacion.trim().length < 10) {
      throw new Error("Relación del hecho debe describirse con más detalle.");
    }

    if (!direccion || typeof direccion !== 'string') {
      throw new Error("Dirección del hecho es obligatoria.");
    }

    if (!fecha || isNaN(Date.parse(fecha))) {
      throw new Error("Fecha del hecho inválida.");
    }

    if (hora && !/^\\d{2}:\\d{2}$/.test(hora)) {
      throw new Error("Hora del hecho inválida (formato esperado HH:MM).");
    }
    
    // Identificador único de la entidad
    this.id = id;
    this.relacion = relacion.trim();
    this.direccion = direccion.trim();
    this.fecha = new Date(fecha);
    this.hora = hora || null;
  }
}