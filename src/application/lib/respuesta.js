class Respuesta {
  constructor (mensaje, finalizado, datos = null, extras = null) {
    this.mensaje = mensaje || 'OK';
    this.finalizado = finalizado !== null ? finalizado : true;
    this.datos = datos;
    if (extras) {
      this.extras = extras;
    }
  }
}
module.exports = { Respuesta };
