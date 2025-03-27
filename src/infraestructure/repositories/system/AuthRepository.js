'use strict';

const Repository = require('../Repository');
const { saltRounds } = require('../../../common/config/auth');
const bcrypt = require('bcrypt');

module.exports = function authRepository (models) {
  const { auth } = models;

  function codificarContrasena (password) {
    return bcrypt.hash(password, saltRounds);
  }

  function verificarContrasena (password, hash) {
    return bcrypt.compare(password, hash);
  }

  async function findOne (params = {}) {
    const query = {};
    query.attributes = [
      'id',
      'ip',
      'state',
      'estado',
      'parametros',
      'navegador',
      'userAgent',
      'tokens',
      'idEntidad',
      'idRol',
      'idUsuario',
      'userCreated',
      'userUpdated',
      'userDeleted'
    ];
    query.where = params;
    query.include = [];
    const result = await auth.findOne(query);
    if (!result) {
      return null;
    }
    return result.toJSON();
  }

  return {
    codificarContrasena,
    verificarContrasena,
    findOne,
    createOrUpdate : (item, t) => Repository.createOrUpdate(item, auth, t),
    deleteItemCond : (params, t) => Repository.deleteItemCond(params, auth, t)
  };
};
