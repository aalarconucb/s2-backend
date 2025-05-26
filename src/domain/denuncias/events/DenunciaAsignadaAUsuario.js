export class DenunciaAsignadaAUsuario {
  constructor({ idDenuncia, idUsuarioAsignado, fecha }) {
    this.idDenuncia = idDenuncia;
    this.idUsuarioAsignado = idUsuarioAsignado;
    this.fecha = fecha;
    this.tipo = 'DenunciaAsignadaAUsuario';
  }
}