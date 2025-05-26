export class DenunciaRegistrada {
  constructor({ id, codigoRuv, fecha }) {
    this.id = id;
    this.codigoRuv = codigoRuv;
    this.fecha = fecha;
    this.tipo = 'DenunciaRegistrada';
  }
}
