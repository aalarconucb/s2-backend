const Joi = require('joi');

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const date = /(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d/i;

const customCiValidation = (value, helpers) => {
  if (!value.match(/^([eE][-]{1}){0,1}[0-9]{4,10}(-[A-Za-z0-9]{2}){0,1}$/)) {
    throw new Error(`${value} no es un número de documento válido.`);
  }
  return value;
};

module.exports =  {
  crearDenuncia: Joi.object().keys({
    tipologiaPrincipal  : Joi.string().regex(uuid).required(),
    tipologiaSecundaria : Joi.string().allow(null).regex(uuid).optional(),
    relacionHecho       : Joi.string().min(500).required(),
    direccionHecho      : Joi.string().allow(null).min(2).max(150).optional(),
    documento           : Joi.string().allow(null).min(40).optional(),
    victimaDenuncia     : Joi.array().length(1).items(Joi.object().keys({
      victimaPersona: Joi.object().keys({
        tipoDocumento      : Joi.string().allow(null).regex(uuid).optional(),
        numeroDocumento    : Joi.string().allow(null).custom(customCiValidation, 'customCi').optional(),
        nombres            : Joi.string().allow(null).min(2).max(40).optional(),
        primerApellido     : Joi.string().allow(null).min(2).max(40).optional(),
        segundoApellido    : Joi.string().allow(null).min(2).max(40).optional(),
        nombreConvencional : Joi.string().allow(null).min(2).max(150).optional(),
        fechaNacimiento    : Joi.string().allow(null).regex(date).optional(),
        telefono           : Joi.string().allow(null).min(7).max(8).optional()
      }).required(),
      direccionDomicilio : Joi.string().min(2).max(150).required(),
      latitudDomicilio   : Joi.number().required(),
      longitudDomicilio  : Joi.number().required(),
      ocupacion          : Joi.string().allow(null).min(2).max(100).optional(),
      institucionLaboral : Joi.string().allow(null).min(2).max(100).optional(),
      direccionLaboral   : Joi.string().allow(null).min(2).max(100).optional(),
      telefonoLaboral    : Joi.string().allow(null).min(7).max(8).optional(),
      embarazo           : Joi.boolean().optional(),
      pobVulnerable      : Joi.array().allow(null).items(Joi.string().regex(uuid)).optional(),
      puebloOriginario   : Joi.string().allow(null).regex(uuid).optional(),
      dependienteVictima : Joi.array().allow(null).items({
        relacionParentezco : Joi.string().regex(uuid).required(),
        dependientePersona : Joi.object().keys({
          tipoDocumento   : Joi.string().allow(null).regex(uuid).optional(),
          numeroDocumento : Joi.string().allow(null).custom(customCiValidation, 'customCi').optional(),
          nombres         : Joi.string().min(2).max(40).required(),
          primerApellido  : Joi.string().min(2).max(40).required(),
          segundoApellido : Joi.string().allow(null).min(2).max(40).optional(),
          fechaNacimiento : Joi.string().allow(null).regex(date).optional(),
          estadoCivil     : Joi.string().allow(null).regex(uuid).optional(),
          genero          : Joi.string().allow(null).regex(uuid).optional(),
          telefono        : Joi.string().allow(null).min(7).max(8).optional()
        }).optional()
      }).optional()
    })).required(),
    denuncianteDenuncia: Joi.array().min(1).max(15).items(Joi.object().keys({
      tipoDenunciante    : Joi.string().regex(uuid).required(),
      relacionParentezco : Joi.string().allow(null).regex(uuid).optional(),
      denunciantePersona : Joi.object().allow(null).keys({
        tipoDocumento   : Joi.string().allow(null).regex(uuid).optional(),
        numeroDocumento : Joi.string().allow(null).custom(customCiValidation, 'customCi').optional(),
        nombres         : Joi.string().min(2).max(40).required(),
        primerApellido  : Joi.string().min(2).max(40).required(),
        segundoApellido : Joi.string().allow(null).min(2).max(40).optional(),
        fechaNacimiento : Joi.string().allow(null).regex(date).optional(),
        genero          : Joi.string().allow(null).regex(uuid).optional(),
        telefono        : Joi.string().allow(null).min(7).max(8).optional()
      }).optional()
    })),
    denunciadoDenuncia: Joi.array().min(1).max(15).items(Joi.object().keys({
      tipoDenunciado     : Joi.string().regex(uuid).required(),
      relacionParentezco : Joi.string().allow(null).regex(uuid).optional(),
      denunciadoPersona  : Joi.object().allow(null).keys({
        tipoDocumento   : Joi.string().allow(null).regex(uuid).optional(),
        numeroDocumento : Joi.string().allow(null).custom(customCiValidation, 'customCi').optional(),
        nombres         : Joi.string().min(2).max(40).required(),
        primerApellido  : Joi.string().min(2).max(40).required(),
        segundoApellido : Joi.string().allow(null).min(2).max(40).optional(),
        fechaNacimiento : Joi.string().allow(null).regex(date).optional(),
        telefono        : Joi.string().allow(null).min(7).max(8).optional(),
        estadoCivil     : Joi.string().allow(null).regex(uuid).optional(),
        genero          : Joi.string().allow(null).regex(uuid).optional()
      }).optional(),
      ocupacion          : Joi.string().allow(null).min(2).max(100).optional(),
      institucionLaboral : Joi.string().allow(null).min(2).max(100).optional(),
      direccionLaboral   : Joi.string().allow(null).min(2).max(100).optional(),
      telefonoLaboral    : Joi.string().allow(null).min(7).max(8).optional()
    }))
  })
};
