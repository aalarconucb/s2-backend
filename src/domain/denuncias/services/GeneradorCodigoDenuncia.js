import { obtenerPrefijosDPA } from './helpers/codigosDPA.js'; // función que lee el catálogo

export class GeneradorCodigoDenuncia {
  constructor({ dpaCatalogo, obtenerSiguienteSecuencia }) {
    this.dpaCatalogo = dpaCatalogo;
    this.obtenerSiguienteSecuencia = obtenerSiguienteSecuencia;
  }

  generar({ codigoMunicipio }) {
    const dpa = this.dpaCatalogo.find(item => item.codigo === codigoMunicipio);
    if (!dpa || !dpa.sigla || !dpa.codigo_departamento) {
      throw new Error("Código de municipio inválido o no encontrado en catálogo DPA.");
    }

    const dep = dpa.codigo_departamento.padStart(2, '0'); // ej. "01"
    const siglaDep = this.obtenerSiglaDepartamento(dep);  // ej. "CH" (Chuquisaca)
    const siglaMun = dpa.sigla;                           // ej. "ALC"
    const secuencia = this.obtenerSiguienteSecuencia();   // ej. "000123"
    const anio = new Date().getFullYear();                // ej. "2025"

    return `${siglaDep}-${siglaMun}-RUV-${secuencia}-${anio}`;
  }

  obtenerSiglaDepartamento(codigo) {
    const mapa = {
      "01": "CH", "02": "LP", "03": "CB", "04": "OR", "05": "PT",
      "06": "TJ", "07": "SC", "08": "BN", "09": "PD"
    };
    return mapa[codigo] || "XX";
  }
}