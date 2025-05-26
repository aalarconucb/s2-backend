import { Ubicacion } from '../valueObjects/Ubicacion.js';

// Entidad del dominio: Denunciado
// Representa una parte del agregado Denuncia, encapsulando datos específicos y posibles comportamientos futuros
export class Denunciado {
  constructor({ nombre, relacion, domicilio, ocupacion, institucionLaboral, direccionLaboral, telefonoLaboral }) {
    if (!nombre || typeof nombre !== 'string' || nombre.trim().length < 3) {
      throw new Error("Nombre del denunciado inválido.");
    }

    if (!relacion || typeof relacion !== 'string') {
      throw new Error("Relación con la víctima requerida.");
    }

    if (!(domicilio instanceof Ubicacion)) {
      throw new Error("Ubicación del domicilio inválida.");
    }

    // Identificador único de la entidad
    this.id = id;
    this.nombre = nombre;
    this.relacion = relacion;
    this.domicilio = domicilio;
    this.ocupacion = ocupacion || null;
    this.institucionLaboral = institucionLaboral || null;
    this.direccionLaboral = direccionLaboral || null;
    this.telefonoLaboral = this.validarTelefono(telefonoLaboral);
  }

  validarTelefono(telefono) {
    if (!telefono) return null;
    const regexBolivia = /^(6|7)[0-9]{7}$/;
    if (!regexBolivia.test(telefono)) {
      throw new Error("Número de teléfono inválido para Bolivia.");
    }
    return telefono;
  }
}
