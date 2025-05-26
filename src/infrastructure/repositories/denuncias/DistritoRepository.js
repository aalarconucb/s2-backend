'use strict';

const Repository = require('../Repository');
const { getQuery, toJSON, toJSONArray } = require('../../lib/util');

module.exports = function distritoRepository (models, Sequelize, sequelize) {
  const { distrito, municipio, dpa, denuncia } = models;
  const { QueryTypes, Op } = Sequelize;

  const attributes = { exclude: ['updatedAt', 'deletedAt', 'userCreated', 'userUpdated', 'userDeleted'] };
  async function buscarDpaDistrito (idDistrito) {
    const query = {
      // attributes : ['id', 'nombres', 'primerApellido', 'segundoApellido', 'numeroDocumento', 'fechaNacimiento'],
      attributes : ['id'],
      where      : {
        id: idDistrito
      },
      include: {
        model      : municipio,
        as         : 'municipioDistrito',
        attributes : ['codigoMunicipio', 'id', 'red', 'nombre'],
        include: {
          model    : dpa,
          as       : 'dpaMunicipio',
          attributes: ['codigo', 'municipio', 'sigla', 'codigoDepartamento', 'codigoProvincia', 'departamento', 'provincia']
        }
      }
    };
    const result = await distrito.findOne(query);
    if (result) return result.toJSON();
    return null;
  }

  // async function obtenerReporte () {
  //   try {
  //     const query = `
  //     select m.nombre,
  //     d.nombre,
  //     d.direccion,
  //     d.telefono,
  //     sum(d.cantidad_abogados) as abogados,
  //     sum(d.cantidad_psicologos) as psicologos,
  //     sum(d.cantidad_trabajadores_sociales) as trabajadores_sociales,
  //     sum(d.infraestructura) as infraestructura,
  //     sum(d.recepcion) as recepcion,
  //     sum(d.oficinas) as oficinas,
  //     sum(d.gabinete_psicologico) as gabinete_psicologico,
  //     sum(d.banios) as banios,
  //     sum(d.agua) as agua,
  //     sum(d.energia_electrica) as energia_electrica,
  //     sum(d.gas) as gas,
  //     sum(d.vehiculos) as vehiculos,
  //     sum(d.motocicletas) as motocicletas,
  //     sum(d.computadoras) as computadoras,
  //     sum(d.impresoras) as impresoras,
  //     sum(d.fotocopiadoras) as fotocopiadoras,
  //     sum(d.telefonos_fijos) as telefonos_fijos,
  //     sum(d.celular_con_whatsapp) as celular_con_whatsapp,
  //     sum(d.material_escritorio) as material_escritorio,
  //     sum(d.material_limpieza) as material_limpieza,
  //     sum(d.material_recreacion) as material_recreacion,
  //     sum(d.material_deportivo) as material_deportivo,
  //     sum(d.utiles_educacionales) as utiles_educacionales,
  //     sum(d.combustible_otras_energias) as combustible_otras_energias
  //     from distrito d, municipio m
  //     where d."id_municipio"  = m.id
  //     group by m.nombre ;`;

  //     const resultado = await sequelize.query(query, {
  //       type: QueryTypes.SELECT
  //     });
  //     return resultado;
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  async function obtenerReporte () {
    try {
      const query = `
      select
        d.nombre as slim,
        d.direccion,
        d.telefono,
        d."_created_at" as fecha_creacion,
        m.nombre as nombre_municipio,
        sd.provincia,
        sd.departamento,
        d.cantidad_abogados as abogados,
        d.cantidad_psicologos as psicologos,
        d.cantidad_trabajadores_sociales as trabajadores_sociales,
        d.infraestructura as infraestructura,
        d.recepcion as recepcion,
        d.oficinas as oficinas,
        d.gabinete_psicologico as gabinete_psicologico,
        d.banios as banios,
        d.agua as agua,
        d.energia_electrica as energia_electrica,
        d.gas as gas,
        d.vehiculos as vehiculos,
        d.motocicletas as motocicletas,
        d.computadoras as computadoras,
        d.impresoras as impresoras,
        d.fotocopiadoras as fotocopiadoras,
        d.telefonos_fijos as telefonos_fijos,
        d.celular_con_whatsapp as celular_con_whatsapp,
        d.material_escritorio as material_escritorio,
        d.material_limpieza as material_limpieza,
        d.material_recreacion as material_recreacion,
        d.material_deportivo as material_deportivo,
        d.utiles_educacionales as utiles_educacionales,
        d.combustible_otras_energias as combustible_otras_energias
      from distrito d
      inner join municipio m on d.id_municipio = m.id
      inner join sys_dpa sd on m.codigo_municipio = sd.codigo;`;

      const resultado = await sequelize.query(query, {
        type: QueryTypes.SELECT
      });
      return resultado;
    } catch (error) {
      console.log(error);
    }
  }

  async function listar (params = {}) {
    const currentYear = new Date().getFullYear();
    const startOfYear = new Date(currentYear, 0, 1);
    const startOfNextYear = new Date(currentYear + 1, 0, 1);

    const query = getQuery(params)
    query.attributes = [
      'id',
      'nombre',
      'direccion',
      'telefono',
      'idMunicipio',
      'estado',
      'createdAt',
      [
        sequelize.literal(`(
          SELECT COUNT(*)
          FROM "denuncia" AS d
          WHERE d."id_distrito" = "distrito"."id"
            AND d."_created_at" >= '${startOfYear.toISOString()}'
            AND d."_created_at" < '${startOfNextYear.toISOString()}'
        )`),
        'denuncias_count'
      ],
      [
        sequelize.literal(`(
          SELECT COUNT(*)
          FROM "sys_usuario" AS su
          WHERE su."id_distrito" = "distrito"."id"
            AND su."estado" = 'ACTIVO'
        )`),
        'usuarios_count'
      ]
    ]

    query.include = [
      {
        model: municipio,
        as: 'municipioDistrito',
        attributes : ['id', 'nombre', 'codigoMunicipio', 'red'],
        include : [
          {
            model: dpa,
            as: 'dpaMunicipio',
            attributes : ['codigo', 'codigoDepartamento', 'municipio', 'provincia', 'departamento'],
            where: params.codigoDepartamento ? { codigoDepartamento: params.codigoDepartamento } : undefined
          }
        ]
      }
    ]

    if (params.nombre) {
      query.where = {
        ...query.where,
        nombre: { [Op.iLike]: `%${params.nombre}%` }
      }
    }

    if (params.municipio) {
      query.include[0].where = {
        ...query.include[0].where,
        nombre: { [Op.iLike]: `%${params.municipio}%` }
      }
    }

    if (params.provincia) {
      query.where = {
        ...query.where,
        '$municipioDistrito.dpaMunicipio.provincia$': {
          [Op.iLike]: `%${params.provincia}%`
        }
      };
    }

    if (params.codigoDepartamento) {
      query.where = {
        ...query.where,
        '$municipioDistrito.dpaMunicipio.codigo_departamento$': params.codigoDepartamento,
      }
    }

    if (params.codigoProvincia) {
      query.where = {
        ...query.where,
        '$municipioDistrito.dpaMunicipio.codigo_provincia$': params.codigoProvincia
      };
    }

    if (params.codigoMunicipio) {
      query.include[0].where = {
        ...query.include[0].where,
        id: params.codigoMunicipio
      }
    }

    const result = await distrito.findAndCountAll(query);
    return toJSON(result);
  }

  return {
    createOrUpdate : (item, t) => Repository.createOrUpdate(item, distrito, t),
    findById       : id => Repository.findById(id, distrito, attributes),
    buscarDpaDistrito,
    obtenerReporte,
    listar
  };
};
