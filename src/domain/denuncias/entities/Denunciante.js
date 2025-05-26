import { DocumentoIdentidad } from '../valueObjects/DocumentoIdentidad.js';
import { Ubicacion } from '../valueObjects/Ubicacion.js';

// Entidad del dominio: Denunciante
// Representa una parte del agregado Denuncia, encapsulando datos específicos y posibles comportamientos futuros
export class Denunciante {
  constructor({ nombre, documento, domicilio, telefono, tipo }) {
    // Identificador único de la entidad
    this.id = id;
    this.nombre = nombre.trim();
    this.documento = documento;
    this.domicilio = domicilio;
    this.telefono = this.validarTelefono(telefono);
    this.tipo = tipo;

    if (!nombre || typeof nombre !== 'string' || nombre.trim().length < 3) {
      throw new Error("Nombre del denunciante inválido.");
    }

    if (!(documento instanceof DocumentoIdentidad)) {
      throw new Error("Documento del denunciante inválido.");
    }

    if (!(domicilio instanceof Ubicacion)) {
      throw new Error("Ubicación del domicilio inválida.");
    }

    if (!['VICTIMA', 'TERCERO'].includes(tipo)) {
      throw new Error("Tipo de denunciante inválido. Debe ser 'VICTIMA' o 'TERCERO'.");
    }
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
