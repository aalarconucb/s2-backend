import { DocumentoIdentidad } from '../valueObjects/DocumentoIdentidad.js';
import { Ubicacion } from '../valueObjects/Ubicacion.js';

// Entidad del dominio: Victima
// Representa una parte del agregado Denuncia, encapsulando datos específicos y posibles comportamientos futuros
export class Victima {
  constructor({ documento, domicilio, ocupacion, institucionLaboral, direccionLaboral, telefonoLaboral, embarazo }) {
    // Identificador único de la entidad
    this.id = id;
    this.documento = documento;
    this.domicilio = domicilio;
    this.ocupacion = ocupacion || null;
    this.institucionLaboral = institucionLaboral || null;
    this.direccionLaboral = direccionLaboral || null;
    this.telefonoLaboral = this.validarTelefono(telefonoLaboral);
    this.embarazo = embarazo ?? false;
    this.estado = 'ACTIVO';

    if (!(documento instanceof DocumentoIdentidad)) {
      throw new Error("Documento de identidad inválido.");
    }

    if (!(domicilio instanceof Ubicacion)) {
      throw new Error("Ubicación del domicilio inválida.");
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