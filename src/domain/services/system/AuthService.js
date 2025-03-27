'use strict';

const debug = require('debug')('app:service:auth');
const crypto = require('crypto');
const Issuer = require('openid-client').Issuer;
const { ErrorApp } = require('../../lib/error');
const url = require('url');
const { config } = require('../../../common');
const { iss } = require('../../lib/util');
const { generateToken } = require('../../../application/lib/auth');

module.exports = function authService (repositories, helpers, res) {
  const { FechaHelper } = helpers;

  const { 
    AuthRepository,
    UsuarioRepository,
    SuscripcionRepository,
    ParametroRepository,
    MenuRepository,
    PermisoRepository
  } = repositories;


  const issuer = new Issuer(iss);

  const cliente = new issuer.Client(config.openid.client);
  cliente.CLOCK_TOLERANCE = 5;

  async function getCode (data) {
    debug('Obtener código state');
    const state = crypto.randomBytes(16).toString('hex');
    const nonce = crypto.randomBytes(16).toString('hex');

    try {
      const authorizationRequest = Object.assign({
        redirect_uri: config.openid.client.redirect_uris[0],
        state,
        nonce
      }, config.openid.client_params);

      const authorizeUrl = cliente.authorizationUrl(authorizationRequest);

      const data = {
        state,
        parametros: {
          nonce
        },
        userCreated: '7171272e-b31b-4c34-9220-9f535c958c5c'
      };
      data.token = 'dsa';
      data.estado = 'INICIO';

      await AuthRepository.createOrUpdate(data);

      return res.success({
        url    : authorizeUrl + '&prompt=consent',
        codigo : state
      });
    } catch (e) {
      return res.error(e);
    }
  }

  async function authorizate (req, info) {
    debug('Autorizar código');
    let user;
    let respuesta;
    try {
      const params = cliente.callbackParams(req);
      if (!params.state) throw new Error('Parámetro state es requerido.');
      if (!params.code) throw new Error('Parámetro code es requerido.');

      const parametros = {state  : params.state, estado : 'INICIO'};

      const resultadoState = await AuthRepository.findOne(parametros);

      if (!resultadoState) throw new Error('Los códigos de verificacion no coinciden. Intente nuevamente.');

      const respuestaCode = await cliente.callback(cliente.redirect_uris[0], params, {
        nonce : resultadoState.parametros.nonce,
        state : resultadoState.state
      });

      resultadoState.tokens = respuestaCode;

      const claims = await cliente.userinfo(respuestaCode.access_token);

      const datosPersona = transformarDatosCiudadania(claims);

      const dataPersona = { numeroDocumento: datosPersona.numeroDocumento, fechaNacimiento: datosPersona.fechaNacimiento };
      if (datosPersona.complemento) dataPersona.complemento = datosPersona.complemento;

      const data = await UsuarioRepository.findByCi(dataPersona);
      if (data) {
        user = await UsuarioRepository.findOne({ usuario: data.usuario });
        if (user.estado === 'ACTIVO') {
          respuesta = await getResponse(user);
          resultadoState.idUsuario = user.id;
          resultadoState.estado = 'ACTIVO';
          // resultadoState.token = respuesta.token;
          await AuthRepository.createOrUpdate(resultadoState);
        } else { // usuario inactivo
          respuesta = {
            url     : getUrl(resultadoState),
            mensaje : 'El usuario no esta ACTIVO en el sistema. Consulte con el administrador del sistema.'
          };
        }
      } else { // no tiene acceso al sistema
        respuesta = {
          url     : getUrl(resultadoState),
          mensaje : `La persona ${claims.profile.nombre.nombres} no tiene acceso al sistema. Consulte con el administrador del sistema.`
        };
      }
      return res.success(respuesta);
    } catch (e) {
      return res.error(e);
    }
  }

  async function refreshToken (idRol, idUsuario) {
    const existeUsuario = await UsuarioRepository.findById(idUsuario);
    if (!existeUsuario) {
      throw new Error('No existe el usuario.');
    }
    return getResponse(existeUsuario, idRol);
  }

  async function logout (code, usuario) {
    debug('Salir del sistema');
    let resultUrl;
    const urlExit = '/statics/oauth/logout.html';
    try {
      const user = await UsuarioRepository.findOne({ usuario });
      if (user) {
        const parametros = {
          state     : code,
          idUsuario : user.id,
          estado    : 'ACTIVO'
        };
        const result = await AuthRepository.findOne(parametros);
        if (result) {
          resultUrl = getUrl(result);
        } else {
          resultUrl = urlExit;
        }
      } else {
        resultUrl = urlExit;
      }
      return res.success({ url: resultUrl });
    } catch (e) {
      return res.error(e);
    }
  }

  function getUrl (data) {
    return url.format(Object.assign(url.parse(issuer.end_session_endpoint), {
      search : null,
      query  : {
        id_token_hint            : data.tokens.id_token,
        post_logout_redirect_uri : cliente.post_logout_redirect_uris[0]
      }
    }));
  }

  async function verificarPermisos (params) {
    try {
      const permisos = await PermisoRepository.verificarPermisos(params);
      return permisos;
    } catch (error) {
    }
  }

  async function getMenusRoles (roles) {
    const idRoles = roles.map(x => x.id);
    const { rows } = await MenuRepository.findByRoles(idRoles);
    return rows;
  }

  async function getPermisos (roles) {
    const idRoles = roles.map(x => x.id);
    const { rows } = await PermisoRepository.findByRoles(idRoles);
    const permisos = {};
    for (const permiso of rows) {
      permisos[permiso.nombre] = true;
    }
    return permisos;
  }

  async function getResponse (usuario) {
    try {
      usuario.menu = await getMenusRoles(usuario.roles);
      usuario.permisos = await getPermisos(usuario.roles);

      usuario.token = await generateToken(ParametroRepository, {
        idRoles           : usuario.roles.map(x => x.id),
        idUsuario         : usuario.id,
        celular           : usuario.celular,
        correoElectronico : usuario.correoElectronico,
        usuario           : usuario.usuario,
        idEntidad         : usuario.entidad.id
      });

      return usuario;
    } catch (error) {
      throw new ErrorApp(error.message, 400);
    }
  }

  async function login (usuario, contrasena, request) {
    try {
      const existeUsuario = await UsuarioRepository.login({ usuario });
      if (!existeUsuario) {
        throw new Error('No existe el usuario.');
      }
      const respuestaVerificacion = await AuthRepository.verificarContrasena(contrasena, existeUsuario.contrasena);
      if (!respuestaVerificacion) {
        throw new Error('Error en su usuario o su contraseña.');
      }
      delete existeUsuario.contrasena;
      const respuesta = await  getResponse(existeUsuario);
      await AuthRepository.deleteItemCond({ idUsuario: existeUsuario.id });
      await AuthRepository.createOrUpdate({
        ip          : request.ipInfo.ip,
        navegador   : request.ipInfo.navigator,
        userAgent   : request.headers['user-agent'],
        token       : respuesta.token,
        idUsuario   : existeUsuario.id,
        idRol       : existeUsuario.roles.map(x => x.id).join(','),
        idEntidad   : existeUsuario.entidad.id,
        userCreated : existeUsuario.id
      });
      return respuesta;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }

  async function getSubscription (idUsuario) {
    const subscriptions = await SuscripcionRepository.findOne({ idUsuario });
    return subscriptions;
  }

  function transformarDatosCiudadania (claims) {
    const fechaNacimiento = FechaHelper.formatearFecha(claims.fecha_nacimiento);
    let numeroDocumento = claims.profile?.documento_identidad?.numero_documento;
    let complemento = null;

    if (claims.profile?.documento_identidad?.numero_documento.includes('-')) {
      ([numeroDocumento, complemento] = claims.profile?.documento_identidad?.numero_documento.split('-'));
    }

    return {
      numeroDocumento,
      complemento,
      tipoDocumento     : claims.profile?.documento_identidad?.tipo_documento,
      fechaNacimiento,
      nombres           : claims.profile?.nombre?.nombres,
      primerApellido    : claims.profile?.nombre?.primer_apellido || '',
      segundoApellido   : claims.profile?.nombre?.segundo_apellido || '',
      correoElectronico : claims.email,
      celular           : claims.celular
    };
  }

  return {
    getSubscription,
    getMenusRoles,
    verificarPermisos,
    login,
    getCode,
    refreshToken,
    authorizate,
    logout
  };
};
