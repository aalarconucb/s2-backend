'use strict';

const debug = require('debug')('app:service:rol');
const Service = require('../Service');
const { ErrorApp } = require('../../lib/error');
const { generateTokenInfinite, generateToken } = require('../../../application/lib/auth');

module.exports = function rolService (repositories, helpers, res) {
  const { AplicacionRepository, AplicacionPermisoRepository, PermisoRepository } = repositories;

  async function findAll (params = {}) {
    debug('Lista de roles|filtros');
    try {
      const resultado = await AplicacionRepository.findAll(params);
      return resultado;
    } catch (err) {
      debug(err);
      throw new ErrorApp(err.message, 400);
    }
  }

  async function listarPermisos (idAplicacion) {
    debug('Lista de roles|filtros');
    try {
      const permisos = await PermisoRepository.findAll({ tipo: 'INTEROPERABILIDAD' });
      let permisosRol = [];
      if (idAplicacion) {
        permisosRol = await PermisoRepository.findAll({ idAplicacion, tipo: 'INTEROPERABILIDAD' });
        for (const permiso of permisos.rows) {
          const existe = permisosRol.rows.find(x => x.id === permiso.id);
          if (existe) {
            permiso.permitido = true;
          }
        }
      }
      return permisos.rows;
    } catch (err) {
      debug(err);
      throw new ErrorApp(err.message, 400);
    }
  }

  async function findOne (params) {
    try {
      const entidad = await AplicacionRepository.findOne(params);
      if (!entidad) {
        throw new Error('La entidad no existe');
      }
      return entidad;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function findById (id) {
    debug('Buscando rol por ID');
    try {
      const resultado = await AplicacionRepository.findById(id);
      return resultado;
    } catch (err) {
      debug(err);
      throw new ErrorApp(err.message, 400);
    }
  }

  async function createOrUpdate (data) {
    debug('Crear o actualizar rol');
    let aplicacion;
    try {
      if (data.id) {
        delete data.token;
      }

      aplicacion = await AplicacionRepository.createOrUpdate(data);

      let token = '';
      const datosToken = {
        id        : aplicacion.id,
        nombre    : aplicacion.nombre,
        idEntidad : aplicacion.idEntidad
      };

      if (data.caducidad) {
        datosToken.expiresIn = `${data.caducidad}h`;
      }

      if (!data.id || data.regenerar) {
        token = await generateTokenInfinite(datosToken);
        aplicacion = await AplicacionRepository.createOrUpdate({ id: aplicacion.id, token });
      }

      if (data.permisos) {
        await AplicacionPermisoRepository.deleteItemCond({ idAplicacion: aplicacion.id  });

        for (const permiso of data.permisos) {
          await AplicacionPermisoRepository.createOrUpdate({
            idAplicacion : aplicacion.id,
            idPermiso    : permiso,
            userCreated  : data.userCreated || data.userUpdated
          });
        }
      }
      return aplicacion;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function deleteItem (id) {
    debug('Eliminando rol', id);
    try {
      const rol = await AplicacionRepository.findById(id);
      if (!rol) throw new Error('No se encontro el rol.');
      if (rol.admin) {
        throw new Error('No se puede eliminar un administrador de sistema.');
      }
      if (rol.ciudadano) {
        throw new Error('No se puede eliminar el rol público.');
      }
      const resultado = await AplicacionRepository.deleteItem(id);
      return resultado;
    } catch (err) {
      debug(err);
      throw new ErrorApp(err.message, 400);
    }
  }

  return {
    findOne,
    listarPermisos,
    findAll,
    findById,
    createOrUpdate,
    deleteItem
  };
};
