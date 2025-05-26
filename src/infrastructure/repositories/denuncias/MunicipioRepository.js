'use strict';

const Repository = require('../Repository');
const { getQuery, toJSON, toJSONArray } = require('../../lib/util');

module.exports = function municipioRepository (models, Sequelize) {
  const { municipio, dpa, distrito } = models;
  const { Op } = Sequelize;

  const attributes = ['id', 'nombre', 'rutaLogo', 'direccion', 'telefono', 'codigoMunicipio', 'red', 'estado', 'createdAt'];

  async function buscarPorCodigoMunicipio (codigoMunicipio) {
    const query = {
      where: {
        codigoMunicipio
      }
    };
    const result = await municipio.findOne(query);
    if (!result) {
      return null;
    }
    return result.toJSON();
  }

  function obtenerMunicipios (codigoProvincia) {
    const query = {
      attributes : ['id', 'codigoMunicipio', 'nombre', 'direccion', 'telefono', 'rutaLogo', 'estado'],
      where      : {
        codigoMunicipio: {
          [Op.like]: `${codigoProvincia}%`,
        },
        estado: 'ACTIVO'
      },
      include: {
        model      : dpa,
        as         : 'dpaMunicipio',
        attributes : ['municipio', 'codigo']
      }
    };

    return municipio.findAll(query);
  }

  function obtenerMunicipiosPorRed (idRed) {
    const query = {
      attributes : ['id', 'codigoMunicipio', 'nombre', 'direccion', 'telefono', 'rutaLogo'],
      where      : {
        red: idRed,
        estado: 'ACTIVO'
      },
      include: {
        model      : dpa,
        as         : 'dpaMunicipio',
        attributes : ['municipio', 'codigo']
      }
    };

    return municipio.findAll(query);
  }

  function obtenerDistritos (idMunicipio) {
    const query = {
      attributes : ['id', 'nombre', 'direccion', 'telefono'],
      where      : {
        idMunicipio
      }
    };

    return distrito.findAll(query);
  }

  function obtenerDepartamento (idMunicipio) {
    const query = {
      where: {
        id: idMunicipio,
        estado: 'ACTIVO'
      }
    };
    return municipio.findOne(query);
  }

  async function listar (params = {}) {
    const query = getQuery(params)
    query.attributes = ['id', 'codigoMunicipio', 'nombre', 'direccion', 'telefono', 'rutaLogo', 'estado']
    query.where = {
      estado: {
      [Op.ne]: 'INACTIVO'
    }}

    query.include = [
      {
        model      : dpa,
        as         : 'dpaMunicipio',
        attributes : ['codigo', 'departamento', 'municipio', 'provincia', 'codigoDepartamento'],
      }
    ]

    if (params.codigoDepartamento) {
      query.include[0].where = {
        codigoDepartamento: params.codigoDepartamento
      }
    }

    if (params.provincia) {
      query.include[0].where = {
        provincia: { [Op.iLike]: `%${params.provincia}%` }
      }
    }

    if (params.nombre) {
      query.where = {
        nombre: { [Op.iLike]: `%${params.nombre}%` }
      }
    }

    const result = await municipio.findAndCountAll(query);
    return toJSON(result)
  }

  function obtenerMunicipiosPorDepartamento (codigoDepartamento) {
    const query = {
      attributes : ['id', 'codigoMunicipio', 'nombre', 'direccion', 'telefono', 'estado'],
      where      : {
        estado: 'ACTIVO'
      },
      include: {
        model      : dpa,
        as         : 'dpaMunicipio',
        attributes : ['municipio', 'codigo', 'departamento', 'codigo', 'codigoDepartamento'],
        where: {
          codigoDepartamento: codigoDepartamento
        }
      }
    };
    return municipio.findAll(query);
  }

  return {
    createOrUpdate : (item, t) => Repository.createOrUpdate(item, municipio, t),
    findById       : id => Repository.findById(id, municipio, attributes),
    buscarPorCodigoMunicipio,
    obtenerMunicipios,
    obtenerMunicipiosPorRed,
    obtenerDistritos,
    obtenerDepartamento,
    listar,
    obtenerMunicipiosPorDepartamento
  };
};
