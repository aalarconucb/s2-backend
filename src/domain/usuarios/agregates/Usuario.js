// Aggregate Root del módulo de Usuarios
export class Usuario {
  constructor({ id, nombreCompleto, correo, rol, estado = 'ACTIVO' }) {
    this.id = id;
    this.nombreCompleto = nombreCompleto;
    this.correo = correo;
    this.rol = rol;
    this.estado = estado;
  }

  desactivar() {
    if (this.estado !== 'ACTIVO') {
      throw new Error('Solo se puede desactivar un usuario activo.');
    }
    this.estado = 'INACTIVO';
  }

  activar() {
    if (this.estado !== 'INACTIVO') {
      throw new Error('Solo se puede activar un usuario inactivo.');
    }
    this.estado = 'ACTIVO';
  }

  cambiarRol(nuevoRol) {
    if (!nuevoRol) {
      throw new Error('El nuevo rol no puede estar vacío.');
    }
    this.rol = nuevoRol;
  }
}
