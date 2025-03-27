'use strict';

const jwt = require('jsonwebtoken');
const { config } = require('../../common');

function sign (payload, secret, callback) {
  return jwt.sign(payload, secret, callback);
}

function verify (token, secret, callback) {
  return jwt.verify(token, secret, callback);
}

function permissions (context, permission) {
  if (context.permissions) {
    let type;
    permission = permission.split('|');

    for (const i in permission) {
      if (context.permissions.indexOf(permission[i]) !== -1) {
        return true;
      } else {
        type = permission[i].split(':')[1].toUpperCase();
      }
    }
    throw new Error(`NOT_AUTHORIZED:${type || 'READ'}`);
  } else {
    throw new Error('NOT_AUTHORIZED:READ');
  }
}

async function generateToken (Parametro, data) {
  // Generando token
  let token;
  const { descripcion: tiempoToken } = await Parametro.findOne({ grupo: 'CONFIG', codigo: 'TK' });
  let exp = tiempoToken;
  if (exp) {
    console.log('Tiempo del token en minutos:', exp);
    exp = Math.floor(Date.now() / 1000) + (parseInt(exp) * 60);
    token = await sign({
      ...data,
      exp
    }, config.auth.secret);
  } else {
    throw new Error('No existe el parámetro JWT_TOKEN_EXPIRATION');
  }

  return token;
}

function generateTokenInfinite (data) {
  return sign(data, config.auth.secret);
}

async function userData (req, services) {
  const { headers } = req;
  let user;

  if (headers.authorization) {
    try {
      const data = await verify(req.headers.authorization.replace('Bearer ', ''), config.auth.secret);
      const { UsuarioService } = services;
      user = await UsuarioService.getUser(data.usuario, false);
      return user.data;
    } catch (e) {
      throw new Error(`Error al crear el token: ${e.message}`);
    }
  }
}

module.exports = {
  sign,
  verify,
  permissions,
  generateToken,
  generateTokenInfinite,
  userData
};
