export class DocumentoIdentidad {
  constructor({ tipo, numero }) {
    const tiposValidos = ['CI', 'PAS', 'EXT', 'OTRO'];
    if (!tiposValidos.includes(tipo)) {
      throw new Error("Tipo de documento inválido. Permitidos: CI, PAS, EXT, OTRO.");
    }

    if (!numero || typeof numero !== 'string' || numero.length < 8) {
      throw new Error("Número de documento inválido.");
    }

    this.tipo = tipo;
    this.numero = numero;
  }
}