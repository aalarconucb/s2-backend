'use strict';

const debug = require('debug')('app:service:rol');
const Service = require('../Service');
const { ErrorApp } = require('../../lib/error');
module.exports = function rolService (repositories, helpers, res) {
  const { RolRepository, RolRutaRepository, RolMenuRepository, RolPermisoRepository, transaction, PermisoRepository } = repositories;

  async function findAll (params = {}) {
    debug('Lista de roles|filtros');
    try {
      const resultado = await RolRepository.findAll(params);
      return resultado;
    } catch (err) {
      debug(err);
      throw new ErrorApp(err.message, 400);
    }
  }

  async function listarPermisos (idRol) {
    debug('Lista de roles|filtros');
    try {
      const permisos = await PermisoRepository.findAll({ tipo: 'SISTEMA' });
      let permisosRol = [];
      if (idRol) {
        permisosRol = await PermisoRepository.findAll({ idRol, tipo: 'SISTEMA' });
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
      const entidad = await RolRepository.findOne(params);
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
      const resultado = await RolRepository.findById(id);
      return resultado;
    } catch (err) {
      debug(err);
      throw new ErrorApp(err.message, 400);
    }
  }

  async function createOrUpdate (data) {
    debug('Crear o actualizar rol');
    let rol;
    try {
      rol = await RolRepository.createOrUpdate(data);
      if (data.menus) {
        await RolMenuRepository.deleteItemCond({ idRol: rol.id });
        for (const menu of data.menus) {
          await RolMenuRepository.createOrUpdate({
            idRol       : rol.id,
            idMenu      : menu,
            userCreated : data.userCreated || data.userUpdated
          });
        }
      }

      if (data.permisos) {
        await RolPermisoRepository.deleteItemCond({ idRol: rol.id });

        for (const permiso of data.permisos) {
          await RolPermisoRepository.createOrUpdate({
            idRol       : rol.id,
            idPermiso   : permiso,
            userCreated : data.userCreated || data.userUpdated
          });
        }
      }
      return rol;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function deleteItem (id) {
    debug('Eliminando rol', id);
    try {
      const rol = await RolRepository.findById(id);
      if (!rol) throw new Error('No se encontro el rol.');
      if (rol.admin) {
        throw new Error('No se puede eliminar un administrador de sistema.');
      }
      if (rol.ciudadano) {
        throw new Error('No se puede eliminar el rol público.');
      }
      const resultado = await RolRepository.deleteItem(id);
      return resultado;
    } catch (err) {
      debug(err);
      throw new ErrorApp(err.message, 400);
    }
  }
  async function actualizarMenus (idRol, menus) {
    debug('Actualizando menus');
    const idRolMenus = [];
    let transaccion;
    try {
      transaccion = await transaction.create();
      // recuperando los menus del rol
      const rolMenus = await RolMenuRepository.findAll({ idRol });
      // recuperando los idRolMenu
      rolMenus.rows.forEach(rolMenu => {
        idRolMenus.push(rolMenu.id);
      });
      // eliminando los RolMenus anteriores
      await RolMenuRepository.deleteItem(idRolMenus, transaccion);
      // creamos los nuevos Roles Menu uno por uno
      for (const menu of menus) {
        await RolMenuRepository.createOrUpdate({ idRol, idMenu: menu }, transaccion);
      }
      await transaction.commit(transaccion);
    } catch (error) {
      debug(error);
      await transaction.rollback(transaccion);
      throw new ErrorApp(error.message, 400);
    }
  }

  async function actualizarRutas (idRol, rutas) {
    debug('Actualizando rutas');
    const idRolRutas = [];
    let transaccion;
    try {
      transaccion = await transaction.create();
      // recuperando las rutas del rol
      const rolRutas = await RolRutaRepository.findAll({ idRol });
      // recuperando los idRolRuta
      rolRutas.rows.forEach(rolMenu => {
        idRolRutas.push(rolMenu.id);
      });
      // eliminando los RolRuta anteriores
      await RolRutaRepository.deleteItem(idRolRutas, transaccion);
      // creamos los nuevos Roles Ruta uno por uno
      for (const ruta of rutas) {
        await RolRutaRepository.createOrUpdate({ idRol, idRuta: ruta }, transaccion);
      }
      await transaction.commit(transaccion);
    } catch (error) {
      debug(error);
      await transaction.rollback(transaccion);
      throw new ErrorApp(error.message, 400);
    }
  }
  return {
    findOne,
    listarPermisos,
    findAll,
    findById,
    createOrUpdate,
    deleteItem,
    actualizarMenus,
    actualizarRutas
  };
};
