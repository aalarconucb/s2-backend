export class DenunciaFinalizada {
  constructor({ id, fechaFinalizacion }) {
    this.id = id;
    this.fechaFinalizacion = fechaFinalizacion;
    this.tipo = 'DenunciaFinalizada';
  }
}
