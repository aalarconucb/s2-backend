const ValidateJS = require('validate.js');

const SchemaMiddleware = function (services) {
  function validarSchema (schema) {
    return async function _middleware (req, res, next) {
      const resultadoValidacion = ValidateJS(req.body, schema);
      if (!resultadoValidacion) {
        next();
      }
      const errores = [];
      for (const key in resultadoValidacion) {
        for (const error of resultadoValidacion[key]) {
          errores.push(error);
        }
      }
      res.status(412).json({
        finalizado : false,
        mensaje    : errores,
        data       : null
      });
    };
  }

  return {
    validarSchema
  };
};

module.exports = function (services) {
  return new SchemaMiddleware(services);
};
