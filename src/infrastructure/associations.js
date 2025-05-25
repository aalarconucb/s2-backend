// 'use strict';

// // Definiendo asociaciones de las tablas
// module.exports = function associations (models) {
//   const {
//     rol,
//     auth,
//     usuario,
//     permiso,
//     entidad,
//     rolPermiso,
//     rolUsuario,
//     rolMenu,
//     menu,
//     aplicacion,
//     aplicacionPermiso
//   } = models;

//   auth.belongsTo(usuario, { foreignKey: { name: 'idUsuario' }, as: 'usuario' });
//   usuario.hasMany(auth,  { foreignKey: { name: 'idUsuario' }, as: 'sesiones' });

//   rol.belongsTo(entidad, { foreignKey: { name: 'idEntidad' }, as: 'entidad' });
//   entidad.hasMany(rol,  { foreignKey: { name: 'idEntidad' }, as: 'roles' });

//   aplicacion.belongsTo(entidad, { foreignKey: { name: 'idEntidad' }, as: 'entidad' });
//   entidad.hasMany(aplicacion,  { foreignKey: { name: 'idEntidad' }, as: 'aplicaciones' });

//   entidad.belongsTo(entidad, { foreignKey: { name: 'idEntidad' }, as: 'entidadPadre' });
//   entidad.hasMany(entidad,  { foreignKey: { name: 'idEntidad' }, as: 'entidades' });

//   usuario.belongsTo(entidad, { foreignKey: { name: 'idEntidad' }, as: 'entidad' });
//   entidad.hasMany(usuario,  { foreignKey: { name: 'idEntidad' }, as: 'usuarios' });

//   menu.belongsTo(menu, { foreignKey: { name: 'idMenu' }, as: 'menuSuperior' });

//   rol.belongsToMany(menu, { through: { model: rolMenu, unique: false }, as: 'menus', foreignKey: 'idRol' });
//   menu.belongsToMany(rol, { through: { model: rolMenu, unique: false }, as: 'roles', foreignKey: 'idMenu' });

//   rol.belongsToMany(permiso, { through: { model: rolPermiso, unique: false }, as: 'permisos', foreignKey: 'idRol' });
//   permiso.belongsToMany(rol, { through: { model: rolPermiso, unique: false }, as: 'roles', foreignKey: 'idPermiso' });

//   aplicacion.belongsToMany(permiso, { through: { model: aplicacionPermiso, unique: false }, as: 'permisos', foreignKey: 'idAplicacion' });
//   permiso.belongsToMany(aplicacion, { through: { model: aplicacionPermiso, unique: false }, as: 'aplicaciones', foreignKey: 'idPermiso' });

//   // Roles de usuario
//   usuario.belongsToMany(rol,  { through: { model: rolUsuario, unique: false }, as: 'roles', foreignKey: 'idUsuario' });
//   rol.belongsToMany(usuario, { through: { model: rolUsuario, unique: false }, as: 'usuarios', foreignKey: 'idRol' });

//   auth.belongsTo(usuario, { foreignKey: { name: 'idUsuario' }, as: 'usuarioSesion' });
//   usuario.hasMany(auth,  { foreignKey: { name: 'idUsuario' }, as: 'sesionesUsuario' });

//   auth.belongsTo(entidad, { foreignKey: { name: 'idEntidad' }, as: 'entidadSesion' });
//   entidad.hasMany(auth,  { foreignKey: { name: 'idEntidad' }, as: 'sesionesEntidad' });

//   return models;
// };

'use strict';

// Definiendo asociaciones de las tablas
module.exports = function associations (models) {
  const {
    rol,
    auth,
    usuario,
    permiso,
    rolPermiso,
    rolUsuario,
    rolMenu,
    menu,
    aplicacion,
    aplicacionPermiso,
    municipio,
    distrito,
    dpa,
    denuncia,
    parametro,
    victima,
    dependiente,
    denunciante,
    denunciado,
    preregistro,
    persona,
    victimaPoblacionVulnerable,
    usuarioCaso,
    fichaPsicologica,
    fichaSeguimientoLegal,
    fichaSeguimientoPsicologico,
    fichaSeguimientoSocial,
    fichaSocial,
    fichaVisitaSocial,
    informeLegal,
    informePsicologico,
    informeSocial,
    memorial,
    terapiaSlim,
    terapiaExterna,
    denunciaHistorico,
    interrupcionLegalEmbarazo,
    solicitudAtencion,
    solicitudTransferencia,
    fichaReferencia,
    fichaContrareferencia,
    red,
    fichaSeguimientoSocialAdjunto,
    fichaSocialAdjunto,
    fichaVisitaSocialAdjunto,
    certificadoMedico,
    notaExterna,
    citacion,
    requerimientoInforme,
    orientacion,
    victimaAutoIdentificacion,
    asistenciaFamiliar,
    partesAsistenciaFamiliar,
    dependientesPartesAsistencia,
    asistenciaFamiliarAdjunto,
    domicilio
  } = models;

  auth.belongsTo(usuario, { foreignKey: { name: 'idUsuario' }, as: 'usuario' });
  usuario.hasMany(auth,  { foreignKey: { name: 'idUsuario' }, as: 'sesiones' });

  menu.belongsTo(menu, { foreignKey: { name: 'idMenu' }, as: 'menuSuperior' });
  menu.hasMany(menu,  { foreignKey: { name: 'idMenu' }, as: 'menuInferior' });

  rol.belongsToMany(menu, { through: { model: rolMenu, unique: false }, as: 'menus', foreignKey: 'idRol' });
  menu.belongsToMany(rol, { through: { model: rolMenu, unique: false }, as: 'roles', foreignKey: 'idMenu' });

  rol.belongsToMany(permiso, { through: { model: rolPermiso, unique: false }, as: 'permisos', foreignKey: 'idRol' });
  permiso.belongsToMany(rol, { through: { model: rolPermiso, unique: false }, as: 'roles', foreignKey: 'idPermiso' });

  aplicacion.belongsToMany(permiso, { through: { model: aplicacionPermiso, unique: false }, as: 'permisos', foreignKey: 'idAplicacion' });
  permiso.belongsToMany(aplicacion, { through: { model: aplicacionPermiso, unique: false }, as: 'aplicaciones', foreignKey: 'idPermiso' });

  // Roles de usuario
  usuario.belongsToMany(rol,  { through: { model: rolUsuario, unique: false }, as: 'roles', foreignKey: 'idUsuario' });
  rol.belongsToMany(usuario, { through: { model: rolUsuario, unique: false }, as: 'usuarios', foreignKey: 'idRol' });

  // APLICACION
  distrito.belongsTo(municipio, { foreignKey: { name: 'idMunicipio', field: 'id_municipio' }, as: 'municipioDistrito' });
  municipio.hasMany(distrito, { foreignKey: { name: 'idMunicipio', field: 'id_municipio' }, as: 'distritosMunicipio' });

  dpa.hasMany(municipio, { foreignKey: { name: 'codigoMunicipio', field: 'codigo_municipio' }, sourceKey: 'codigo', as: 'municipioDpa' });
  municipio.belongsTo(dpa, { foreignKey: { name: 'codigoMunicipio', field: 'codigo_municipio' }, targetKey: 'codigo', as: 'dpaMunicipio' });

  red.hasMany(municipio, { foreignKey: { name: 'red' }, as: 'municipioRed' });
  municipio.belongsTo(red, { foreignKey: { name: 'red' }, as: 'redMunicipio' });

  /* */
  usuario.belongsTo(municipio, { foreignKey: { name: 'idMunicipio', field: 'id_municipio' }, as: 'municipioUsuario' });
  usuario.belongsTo(distrito, { foreignKey: { name: 'idDistrito', field: 'id_distrito' }, as: 'distritoUsuario' });
  usuario.belongsTo(dpa, { foreignKey: { name: 'codDepartamento', field: 'cod_departamento' }, as: 'departamentoUsuario' });

  // declaraciones inversas para usuario
  municipio.hasMany(usuario, { foreignKey: { name: 'idMunicipio', field: 'id_municipio' }, as: 'usuarios' });
  distrito.hasMany(usuario, { foreignKey: { name: 'idDistrito', field: 'id_distrito' }, as: 'usuarios' });
  dpa.hasMany(usuario, { foreignKey: { name: 'codDepartamento', field: 'cod_departamento' }, as: 'usuarios' });
  /* */

  distrito.hasMany(denuncia, { foreignKey: { name: 'idDistrito', field: 'id_distrito' }, as: 'denunciaDistrito' });
  denuncia.belongsTo(distrito, { foreignKey: { name: 'idDistrito', field: 'id_distrito' }, as: 'distritoDenuncia' });

  distrito.hasMany(requerimientoInforme, { foreignKey: { name: 'idDistrito', field: 'id_distrito' }, as: 'requerimientoInformeDistrito' });
  requerimientoInforme.belongsTo(distrito, { foreignKey: { name: 'idDistrito', field: 'id_distrito' }, as: 'distritoRequerimientoInforme' });

  distrito.hasMany(orientacion, { foreignKey: { name: 'idDistrito',  field: 'id_distrito' }, as: 'orientacionDistrito' });
  orientacion.belongsTo(distrito, { foreignKey: { name: 'idDistrito',  field: 'id_distrito' }, as: 'distritoOrientacion' });

  distrito.hasMany(solicitudAtencion, { foreignKey: { name: 'idDistrito', field: 'id_distrito' }, as: 'solicitudAtencionDistrito' });
  solicitudAtencion.belongsTo(distrito, { foreignKey: { name: 'idDistrito', field: 'id_distrito'}, as: 'distritoSolicitudAtencion' });

  parametro.hasMany(denuncia, { foreignKey: { name: 'tipologiaPrincipal', field: 'tipologia_principal' }, as: 'denunciaTipologiaPrincipal' });
  denuncia.belongsTo(parametro, { foreignKey: { name: 'tipologiaPrincipal', field: 'tipologia_principal' }, as: 'parametroTipologiaPrincipal' });
  denuncia.belongsTo(parametro, { foreignKey: { name: 'tipologiaSecundaria', field: 'tipologia_secundaria' }, as: 'parametroTipologiaSecundaria' });

  denuncia.hasMany(solicitudTransferencia, { foreignKey: { name: 'idDenuncia', field: 'id_denuncia' }, as: 'solicitudTransferenciaDenuncia' });
  solicitudTransferencia.belongsTo(denuncia, { foreignKey: { name: 'idDenuncia', field: 'id_denuncia' }, as: 'denunciaSolicitudTransferencia' });

  denuncia.hasMany(victima, { foreignKey: { name: 'idDenuncia', field: 'id_denuncia' }, as: 'victimaDenuncia' });
  victima.belongsTo(denuncia, { foreignKey: { name: 'idDenuncia', field: 'id_denuncia' }, as: 'denunciaVictima' });

  victima.hasMany(dependiente, { foreignKey: { name: 'idVictima', field: 'id_victima' }, as: 'dependienteVictima' });
  dependiente.belongsTo(victima, { foreignKey: { name: 'idVictima', field: 'id_victima' }, as: 'victimaDependiente' });

  denuncia.hasMany(denunciante, { foreignKey: { name: 'idDenuncia', field: 'id_denuncia' }, as: 'denuncianteDenuncia' });
  denunciante.belongsTo(denuncia, { foreignKey: { name: 'idDenuncia', field: 'id_denuncia' }, as: 'denunciaDenunciante' });

  denuncia.hasMany(denunciado, { foreignKey: { name: 'idDenuncia', field: 'id_denuncia' }, as: 'denunciadoDenuncia' });
  denunciado.belongsTo(denuncia, { foreignKey: { name: 'idDenuncia', field: 'id_denuncia' }, as: 'denunciaDenunciado' });

  denuncia.hasMany(solicitudAtencion, { foreignKey: { name: 'idDenuncia', field: 'id_denuncia' }, as: 'solicitudAtencionDenuncia' });
  solicitudAtencion.belongsTo(denuncia, { foreignKey: { name: 'idDenuncia', field: 'id_denuncia' }, as: 'denunciaSolicitudAtencion' });

  denuncia.hasMany(fichaReferencia, { foreignKey: { name: 'idDenuncia', field: 'id_denuncia' }, as: 'fichaReferenciaDenuncia' });
  fichaReferencia.belongsTo(denuncia, { foreignKey: { name: 'idDenuncia', field: 'id_denuncia' }, as: 'denunciaFichaReferencia' });

  denuncia.hasMany(fichaContrareferencia, { foreignKey: { name: 'idDenuncia', field: 'id_denuncia' }, as: 'fichaContrareferenciaDenuncia' });
  fichaContrareferencia.belongsTo(denuncia, { foreignKey: { name: 'idDenuncia', field: 'id_denuncia' }, as: 'denunciaFichaContrareferencia' });

  dpa.hasMany(denuncia, { foreignKey: { name: 'codigoMunicipio', field: 'codigo_municipio' }, as: 'denunciaDpa' });
  denuncia.belongsTo(dpa, { foreignKey: { name: 'codigoMunicipio', field: 'codigo_municipio' }, as: 'dpaDenuncia' });

  persona.hasOne(victima, { foreignKey: { name: 'idPersona', field: 'id_persona' }, as: 'personaVictima' });
  victima.belongsTo(persona, { foreignKey: { name: 'idPersona', field: 'id_persona'}, as: 'victimaPersona' });

  persona.hasOne(dependiente, { foreignKey: { name: 'idPersona', field: 'id_persona' }, as: 'personaDependiente' });
  dependiente.belongsTo(persona, { foreignKey: { name: 'idPersona', field: 'id_persona' }, as: 'dependientePersona' });

  persona.hasOne(denunciante, { foreignKey: { name: 'idPersona', field: 'id_persona' }, as: 'personaDenunciante' });
  denunciante.belongsTo(persona, { foreignKey: { name: 'idPersona', field: 'id_persona' }, as: 'denunciantePersona' });

  persona.hasOne(denunciado, { foreignKey: { name: 'idPersona', field: 'id_persona' }, as: 'personaDenunciado' });
  denunciado.belongsTo(persona, { foreignKey: { name: 'idPersona', field: 'id_persona' }, as: 'denunciadoPersona' });

  persona.belongsTo(parametro, { foreignKey: { name: 'tipoDocumento', field: 'tipo_documento' }, as: 'parametroTipoDocumento' });
  persona.belongsTo(parametro, { foreignKey: { name: 'genero' }, as: 'parametroGenero' });
  persona.belongsTo(parametro, { foreignKey: { name: 'estadoCivil', field: 'estado_civil' }, as: 'parametroEstadoCivil' });

  victima.belongsToMany(parametro,  { through: { model: victimaPoblacionVulnerable, unique: false }, as: 'poblacionVulnerable', foreignKey: 'idVictima' });
  parametro.belongsToMany(victima, { through: { model: victimaPoblacionVulnerable, unique: false }, as: 'victima', foreignKey: 'idPoblacionVulnerable' });

  usuario.belongsToMany(denuncia,  { through: { model: usuarioCaso, unique: false }, as: 'denuncia', foreignKey: 'idUsuario' });
  denuncia.belongsToMany(usuario, { through: { model: usuarioCaso, unique: false }, as: 'usuario', foreignKey: 'idDenuncia' });

  victima.belongsTo(parametro, { foreignKey: { name: 'puebloOriginario', field: 'pueblo_originario' }, as: 'parametroPuebloOriginario' });
  dependiente.belongsTo(parametro, { foreignKey: { name: 'relacionParentezco', field: 'relacion_parentezco' }, as: 'parametroRelacionParentezco' });

  denunciante.belongsTo(parametro, { foreignKey: { name: 'relacionParentezco', field: 'relacion_parentezco' }, as: 'parametroRelacionParentezco' });
  denunciado.belongsTo(parametro, { foreignKey: { name: 'relacionParentezco', field: 'relacion_parentezco' }, as: 'parametroRelacionParentezco' });
  denunciante.belongsTo(parametro, { foreignKey: { name: 'tipoDenunciante', field: 'tipo_denunciante' }, as: 'parametroTipoDenunciante' });
  denunciado.belongsTo(parametro, { foreignKey: { name: 'tipoDenunciado', field: 'tipo_denunciado' }, as: 'parametroTipoDenunciado' });
  solicitudAtencion.belongsTo(parametro, { foreignKey: { name: 'tipoInstrumento', field: 'tipo_instrumento' }, as: 'parametroInstrumento' });

  denuncia.hasMany(fichaPsicologica, { foreignKey: { name: 'idDenuncia', field: 'id_denuncia' }, as: 'fichaPsicologicaDenuncia' });
  fichaPsicologica.belongsTo(denuncia, { foreignKey: { name: 'idDenuncia', field: 'id_denuncia' }, as: 'denunciaFichaPsicologica' });

  denuncia.hasMany(fichaSeguimientoLegal, { foreignKey: { name: 'idDenuncia', field: 'id_denuncia' }, as: 'fichaSeguimientoLegalDenuncia' });
  fichaSeguimientoLegal.belongsTo(denuncia, { foreignKey: { name: 'idDenuncia', field: 'id_denuncia' }, as: 'denunciaFichaSeguimientoLegal' });

  denuncia.hasMany(fichaSeguimientoPsicologico, { foreignKey: { name: 'idDenuncia', field: 'id_denuncia' }, as: 'fichaSeguimientoPsicologicoDenuncia' });
  fichaSeguimientoPsicologico.belongsTo(denuncia, { foreignKey: { name: 'idDenuncia', field: 'id_denuncia' }, as: 'denunciaFichaSeguimientoPsicologico' });

  denuncia.hasMany(fichaSeguimientoSocial, { foreignKey: { name: 'idDenuncia', field: 'id_denuncia' }, as: 'fichaSeguimientoSocialDenuncia' });
  fichaSeguimientoSocial.belongsTo(denuncia, { foreignKey: { name: 'idDenuncia', field: 'id_denuncia' }, as: 'denunciaFichaSeguimientoSocial' });

  fichaSeguimientoSocial.hasMany(fichaSeguimientoSocialAdjunto, { foreignKey: { name: 'idFichaSeguimientoSocial', field: 'id_ficha_seguimiento_social' }, as: 'adjuntoFichaSeguimientoSocial' });
  fichaSeguimientoSocialAdjunto.belongsTo(fichaSeguimientoSocial, { foreignKey: { name: 'idFichaSeguimientoSocial', field: 'id_ficha_seguimiento_social' }, as: 'fichaSeguimientoSocialAdjunto' });

  denuncia.hasMany(fichaSocial, { foreignKey: { name: 'idDenuncia', field: 'id_denuncia' }, as: 'fichaSocialDenuncia' });
  fichaSocial.belongsTo(denuncia, { foreignKey: { name: 'idDenuncia', field: 'id_denuncia' }, as: 'denunciaFichaSocial' });

  fichaSocial.hasMany(fichaSocialAdjunto, { foreignKey: { name: 'idFichaSocial', field: 'id_ficha_social' }, as: 'adjuntoFichaSocial' });
  fichaSocialAdjunto.belongsTo(fichaSocial, { foreignKey: { name: 'idFichaSocial', field: 'id_ficha_social' }, as: 'fichaSocialAdjunto' });

  denuncia.hasMany(fichaVisitaSocial, { foreignKey: { name: 'idDenuncia', field: 'id_denuncia' }, as: 'fichaVisitaSocialDenuncia' });
  fichaVisitaSocial.belongsTo(denuncia, { foreignKey: { name: 'idDenuncia', field: 'id_denuncia' }, as: 'denunciaFichaVisitaSocial' });

  fichaVisitaSocial.hasMany(fichaVisitaSocialAdjunto, { foreignKey: { name: 'idFichaVisitaSocial', field: 'id_ficha_visita_social' }, as: 'adjuntoFichaVisitaSocial' });
  fichaVisitaSocialAdjunto.belongsTo(fichaVisitaSocial, { foreignKey: { name: 'idFichaVisitaSocial', field: 'id_ficha_visita_social' }, as: 'fichaVisitaSocialAdjunto' });

  denuncia.hasMany(informeLegal, { foreignKey: { name: 'idDenuncia', field: 'id_denuncia' }, as: 'informeLegalDenuncia' });
  informeLegal.belongsTo(denuncia, { foreignKey: { name: 'idDenuncia', field: 'id_denuncia' }, as: 'denunciaInformeLegal' });

  denuncia.hasMany(informePsicologico, { foreignKey: { name: 'idDenuncia', field: 'id_denuncia' }, as: 'informePsicologicoDenuncia' });
  informePsicologico.belongsTo(denuncia, { foreignKey: { name: 'idDenuncia', field: 'id_denuncia' }, as: 'denunciaInformePsicologico' });

  denuncia.hasMany(informeSocial, { foreignKey: { name: 'idDenuncia', field: 'id_denuncia' }, as: 'informeSocialDenuncia' });
  informeSocial.belongsTo(denuncia, { foreignKey: { name: 'idDenuncia', field: 'id_denuncia' }, as: 'denunciaInformeSocial' });

  denuncia.hasMany(memorial, { foreignKey: { name: 'idDenuncia', field: 'id_denuncia' }, as: 'memorialDenuncia' });
  memorial.belongsTo(denuncia, { foreignKey: { name: 'idDenuncia', field: 'id_denuncia' }, as: 'denunciaMemorial' });

  denuncia.hasMany(terapiaSlim, { foreignKey: { name: 'idDenuncia', field: 'id_denuncia' }, as: 'terapiaSlimDenuncia' });
  terapiaSlim.belongsTo(denuncia, { foreignKey: { name: 'idDenuncia', field: 'id_denuncia' }, as: 'denunciaTerapiaSlim' });

  denuncia.hasMany(terapiaExterna, { foreignKey: { name: 'idDenuncia', field: 'id_denuncia' }, as: 'terapiaExternaDenuncia' });
  terapiaExterna.belongsTo(denuncia, { foreignKey: { name: 'idDenuncia', field: 'id_denuncia' }, as: 'denunciaTerapiaExterna' });

  denuncia.hasMany(certificadoMedico, { foreignKey: { name: 'idDenuncia', field: 'id_denuncia' }, as: 'certificadoMedicoDenuncia' });
  certificadoMedico.belongsTo(denuncia, { foreignKey: { name: 'idDenuncia', field: 'id_denuncia' }, as: 'denunciaCertificadoMedico' });

  denuncia.hasMany(notaExterna, { foreignKey: { name: 'idDenuncia', field: 'id_denuncia' }, as: 'notaExternaDenuncia' });
  notaExterna.belongsTo(denuncia, { foreignKey: { name: 'idDenuncia', field: 'id_denuncia' }, as: 'denunciaNotaExterna' });

  denuncia.hasMany(citacion, { foreignKey: { name: 'idDenuncia', field: 'id_denuncia' }, as: 'citacionDenuncia' });
  citacion.belongsTo(denuncia, { foreignKey: { name: 'idDenuncia', field: 'id_denuncia' }, as: 'denunciaCitacion' });

  denuncia.hasMany(denunciaHistorico, { foreignKey: { name: 'idDenuncia', field: 'id_denuncia' }, as: 'historicoDenuncia' });
  denunciaHistorico.belongsTo(denuncia, { foreignKey: { name: 'idDenuncia', field: 'id_denuncia' }, as: 'denunciaHistorico' });

  denuncia.hasMany(interrupcionLegalEmbarazo, { foreignKey: { name: 'idDenuncia', field: 'id_denuncia' }, as: 'interrupcionLegalEmbarazoDenuncia' });
  interrupcionLegalEmbarazo.belongsTo(denuncia, { foreignKey: { name: 'idDenuncia', field: 'id_denuncia' }, as: 'denunciaInterrupcionLegalEmbarazo' });

  dpa.hasMany(interrupcionLegalEmbarazo, { foreignKey: { name: 'codigoMunicipio', field: 'codigo_municipio' }, as: 'interrupcionLegalEmbarazoDpa' });
  interrupcionLegalEmbarazo.belongsTo(dpa, { foreignKey: { name: 'codigoMunicipio', field: 'codigo_municipio' }, as: 'dpaInterrupcionLegalEmbarazo' });

  dpa.hasMany(preregistro, { foreignKey: { name: 'codigoMunicipio' }, as: 'preregistroDpa' });
  preregistro.belongsTo(dpa, { foreignKey: { name: 'codigoMunicipio' }, as: 'dpaPreregistro' });

  victima.belongsToMany(parametro,  { through: { model: victimaAutoIdentificacion, unique: false }, as: 'victimaAutoidentificacion', foreignKey: 'idVictima' });
  parametro.belongsToMany(victima, { through: { model: victimaAutoIdentificacion, unique: false }, as: 'victimaAI', foreignKey: 'idAutoIdentificacion' });

  // ASISTENCIA FAMILIAR
  persona.hasOne(partesAsistenciaFamiliar, {foreignKey: { name: 'idPersona', field: 'id_persona' }, as: 'personaPartesAF'} );
  partesAsistenciaFamiliar.belongsTo(persona, { foreignKey: { name: 'idPersona', field: 'id_persona' }, as: 'partesAFPersona' });

  partesAsistenciaFamiliar.belongsTo(parametro, { foreignKey: { name: 'relacionParentezcoDependiente', field: 'relacion_parentezco_dependiente' }, as: 'parametroRelacionParentezco' });

  asistenciaFamiliar.hasMany(partesAsistenciaFamiliar, { foreignKey: { name: 'idAsistenciaFamiliar', field: 'id_asistencia_familiar' }, as: 'partesAsistencia' });
  partesAsistenciaFamiliar.belongsTo(asistenciaFamiliar, { foreignKey: { name: 'idAsistenciaFamiliar', field: 'id_asistencia_familiar' }, as: 'asistenciaPartes' });

  // Asociaciones para DependientesPartesAsistencia
  dependiente.hasMany(dependientesPartesAsistencia, { foreignKey: { name: 'idDependiente', field: 'id_dependiente' }, as: 'DPADependiente'});
  dependientesPartesAsistencia.belongsTo(dependiente, { foreignKey: { name: 'idDependiente', field: 'id_dependiente' }, as: 'dependienteDPA' });

  partesAsistenciaFamiliar.hasMany(dependientesPartesAsistencia, { foreignKey: { name: 'idParte', field: 'id_parte' }, as: 'DPAParte' });
  dependientesPartesAsistencia.belongsTo(partesAsistenciaFamiliar, { foreignKey: { name: 'idParte', field: 'id_parte' }, as: 'parteDPA' });

  asistenciaFamiliar.hasMany(dependientesPartesAsistencia, { foreignKey: { name: 'idAsistenciaFamiliar', field: 'id_asistencia_familiar' }, as: 'DPAAsistenciaFamiliar' });
  dependientesPartesAsistencia.belongsTo(asistenciaFamiliar, { foreignKey: { name: 'idAsistenciaFamiliar', field: 'id_asistencia_familiar' }, as: 'asistenciaFamiliarDPA'});

  // adjunto
  asistenciaFamiliar.hasMany(asistenciaFamiliarAdjunto, { foreignKey: { name: 'idAsistenciaFamiliar', field: 'id_asistencia_familiar' }, as: 'adjuntoAsistenciaFamiliar' });
  asistenciaFamiliarAdjunto.belongsTo(asistenciaFamiliar, { foreignKey: { name: 'idAsistenciaFamiliar', field: 'id_asistencia_familiar' }, as: 'asistenciaFamiliarAdjunto' });

  // denuncia
  denuncia.hasMany(asistenciaFamiliar, { foreignKey: { name: 'idDenuncia', field: 'id_denuncia' }, as: 'asistenciaFamiliarDenuncia' });
  asistenciaFamiliar.belongsTo(denuncia, { foreignKey: { name: 'idDenuncia', field: 'id_denuncia' }, as: 'denunciaAsistenciaFamiliar' });

  // distrito
  distrito.hasMany(asistenciaFamiliar, { foreignKey: { name: 'idDistrito', field: 'id_distrito' }, as: 'asistenciaFamiliarDistrito' });
  asistenciaFamiliar.belongsTo(distrito, { foreignKey: { name: 'idDistrito', field: 'id_distrito' }, as: 'distritoAsistenciaFamiliar' });

  //domicilio
  persona.hasMany(domicilio, { foreignKey: { name: 'idPersona', field: 'id_persona' }, as: 'domicilioPersona' });
  domicilio.belongsTo(persona, { foreignKey: { name: 'idPersona', field: 'id_persona' }, as: 'personaDomicilio' });

  dpa.hasMany(domicilio, { foreignKey: { name: 'codigoMunicipio', field: 'codigo_municipio' }, as: 'domicilioDpa' });
  domicilio.belongsTo(dpa, { foreignKey: { name: 'codigoMunicipio', field: 'codigo_municipio' }, as: 'dpaDomicilio' });

  // lugar de nacimiento de la persona
  dpa.hasMany(persona, { foreignKey: { name: 'lugarNacimiento', field: 'lugar_nacimiento' }, as: 'personaNacimiento' });
  persona.belongsTo(dpa, { foreignKey: { name: 'lugarNacimiento', field: 'lugar_nacimiento' }, as: 'nacimientoPersona' });

  // lugar donde se ha expedido el documento de indentidad
  dpa.hasMany(persona, { foreignKey: { name: 'lugarExpedicion', field: 'lugar_expedicion' }, as: 'personaExpedicionDoc' });
  persona.belongsTo(dpa, { foreignKey: { name: 'lugarExpedicion', field: 'lugar_expedicion' }, as: 'expedicionDocPersona' });

  //Se agrega autoidentificacion indigenaOriginario de persona
  persona.belongsTo(parametro, { foreignKey: { name: 'puebloOriginario', field: 'pueblo_originario' }, as: 'parametroPuebloOriginario' });

  orientacion.belongsTo(parametro, { foreignKey: { name: 'tipoDocumento',  field: 'tipo_documento' }, as: 'parametroTipoDocumento' });

  preregistro.hasOne(usuario, { foreignKey: { name: 'idPreregistro', field: 'id_preregistro', allowNull: true }, as: 'usuario'})
  usuario.belongsTo(preregistro, { foreignKey: { name: 'idPreregistro', field: 'id_preregistro', allowNull: true }, as: 'preregistro'})

  return models;
}
