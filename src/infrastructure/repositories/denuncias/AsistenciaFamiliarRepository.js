'use strict';

const { getQuery, toJSON, toJSONArray } = require('../../lib/util');
const Repository = require('../Repository');

module.exports = function asistenciaFamiliarRepository (models, Sequelize) {
  const { asistenciaFamiliar, partesAsistenciaFamiliar, persona, dependiente, dependientesPartesAsistencia, parametro, domicilio, dpa, denuncia } = models;
  const { Op } = Sequelize;
  // const attributes = {
  //   exclude: ['updatedAt', 'deletedAt', 'userCreated', 'userUpdated', 'userDeleted', 'idDenuncia']
  // };

  // async function crear (data, transaccion) {
  //   return asistenciaFamiliar.create(data,
  //     {
  //       // include     : { all: true, nested: true },
  //       transaction : transaccion
  //     });
  // }

  async function crearPartes (data, transaccion) {
    let _persona = await buscarPersona(data.numeroDocumento)
    if(!_persona) {
      _persona = await crearPersona(data, transaccion)
    }
    data.idPersona = _persona.id
    return partesAsistenciaFamiliar.create(data,
      {
        include     : { all: true, nested: true },
        transaction : transaccion
      });
  }

  async function crearPersona (data, transaccion) {
    return persona.create(data, { transaction: transaccion })
  }

  // ampliar funcion con parametros para busqueda
  async function buscarPersona (numeroDocumento) {
    return persona.findOne({
      where: {
        numeroDocumento: numeroDocumento
      }
    })
  }

  async function crearDependiente (data, transaccion) {
    let _persona = await buscarPersona(data.numeroDocumento)
    if(!_persona) {
      _persona = await crearPersona(data, transaccion )
    }
    data.idPersona = _persona.id
    return dependiente.create(data, { transaction: transaccion })
  }

  async function crearDependientesPartesAsistencia (data, transaccion) {
    return dependientesPartesAsistencia.create(data, { transaction: transaccion })
  }

  async function listar(params = {}) {
    const query = getQuery(params)
    query.attributes = ['id', 'tipoAsistencia', 'estado', 'createdAt', 'idDenuncia']
    query.where = {
      estado: {
        [Op.ne]: 'INACTIVO'
      }
    }
    query.include = [
      {
        model : partesAsistenciaFamiliar,
        as    : 'partesAsistencia',
        attributes: ['id', 'idAsistenciaFamiliar', 'idPersona', 'tipoParte'],
        include: {
          model: persona,
          as : 'partesAFPersona',
          attributes: [
            'id',
            'tipoDocumento',
            'numeroDocumento',
            'nombres',
            'primerApellido',
            'segundoApellido'
          ]
        }
      },
      {
        model : denuncia,
        as    : 'denunciaAsistenciaFamiliar',
        attributes: ['id', 'codigoRuv'],
      }
    ]
    query.distinct = true //

    if (params.idDistrito) {
      query.where.idDistrito = params.idDistrito;
    }

    if (params.estado) {
      query.where.estado = params.estado;
    }

    if (params.numeroDocumento) {
      query.include[0].include.where = {
        numeroDocumento: { [Op.iLike]: `%${params.numeroDocumento}%` }
      }
    }

    const result = await asistenciaFamiliar.findAndCountAll(query)
    return toJSON(result)
  }

  async function getPartes( id ) {
    const partes = await partesAsistenciaFamiliar.findAll({
      where: {
        idAsistenciaFamiliar: id
      },
      include: {
        model: persona,
        as: 'partesAFPersona',
        include: [
          {
            model: domicilio,
            as: 'domicilioPersona',
            include: {
              model: dpa,
              as: 'dpaDomicilio'
            }
          },
          {
            model: parametro,
            as: 'parametroTipoDocumento',
            attributes: ['id', 'codigo', 'nombre']
          }
        ]
      }
    })
    return toJSONArray(partes)
  }

  async function getDependientes (id) {
    const dependientes = await dependiente.findAll({
      attributes: ['id', 'estudia', 'estado', 'idPersona', 'idVictima'],
      include: [
        {
          model: persona,
          as: 'dependientePersona',
          attributes: ['id', 'tipoDocumento', 'numeroDocumento', 'nombres', 'primerApellido', 'segundoApellido', 'genero', 'fechaNacimiento', 'estado', 'profesionOcupacion', 'estadoCivil'],
          include: {
            model: parametro,
            as: 'parametroTipoDocumento',
            attributes: ['id', 'codigo', 'nombre']
          }
        },
        {
          model: dependientesPartesAsistencia,
          as: 'DPADependiente',
          attributes: ['id', 'idParte', 'idAsistenciaFamiliar'],
          where: {
            idAsistenciaFamiliar: id,
            estado: 'ACTIVO'
          }
        }
      ]
    })
    return toJSONArray(dependientes)
  }

  async function listarParaDetalle(idDenuncia) {
    const query = {
      attributes : ['id', 'idDenuncia', 'createdAt'],
      where      : {
        idDenuncia
      }
    };

    const result = await asistenciaFamiliar.findAll(query);
    return toJSONArray(result);
  }

  return {
    findById : id => Repository.findById(id, asistenciaFamiliar),
    createOrUpdate: (item, t) => Repository.createOrUpdate(item, asistenciaFamiliar, t),
    // crear,
    crearPartes,
    crearPersona,
    buscarPersona,
    crearDependiente,
    crearDependientesPartesAsistencia,
    getPartes,
    getDependientes,
    listar,
    listarParaDetalle
  };
};
