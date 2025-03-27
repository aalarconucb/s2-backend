'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const lang = require('../lang');
const { array } = require('../../common');
const moment = require('moment');

/**
 * Carga los modelos de la carpeta especificada
 *
 * @param {string} PATH: Path del directorio de donde se cargará los modelos del sistema
 * @param {object} sequelize: Objeto Sequelize
 * @param {object} opts: Json de configuración permite excluir archivos con nombre exactamente igual `exclude' y con nombre que coincide con las expresiones regulares en la propiedad `excludeRegex'
 */
function loadModels (PATH, sequelize, opts = {}) {
  const files = fs.readdirSync(PATH);
  const models = {};

  if (opts.exclude) {
    array.removeAll(opts.exclude, files);
  }

  // para excluir archivos que cumplen la expresión regular
  if (opts.excludeRegex) {
    const excluir = [];
    opts.excludeRegex.map((re) => {
      const regExp = new RegExp(re);
      files.map((file) => {
        if (regExp.test(file)) {
          excluir.push(file);
        }
      });
    });
    if (excluir.length > 0) {
      array.removeAll(excluir, files);
    }
  }

  files.forEach(function (file) {
    const pathFile = path.join(PATH, file);
    if (fs.statSync(pathFile).isDirectory()) {
      models[file] = loadModels(pathFile, sequelize, opts);
    } else {
      file = file.replace('.js', '');
      models[file] = require(path.join(pathFile))(sequelize, Sequelize.DataTypes);
    }
  });

  return models;
}

/**
 * Cargando los repositorios en la carpeta especificada
 *
 * @param {string} PATH: Path del directorio de donde se cargará los modelos del sistema
 * @param {object} models: Objeto con todos los modelos de la bd
 * @param {object} opts: Json de configuración permite excluir archivos con nombre exactamente igual `exclude' y con nombre que coincide con las expresiones regulares en la propiedad `excludeRegex'
 */
function loadRepositories (PATH, models, Sequelize, opts = {}) {
  const files = fs.readdirSync(PATH);
  const repositories = {};

  if (opts.exclude) {
    array.removeAll(opts.exclude, files);
  }

  // para excluir tambien expresiones regulares
  if (opts.excludeRegex) {
    const excluir = [];
    opts.excludeRegex.map((re) => {
      const regExp = new RegExp(re);
      files.map((file) => {
        if (regExp.test(file)) {
          excluir.push(file);
        }
      });
    });
    if (excluir.length > 0) {
      array.removeAll(excluir, files);
    }
  }

  files.forEach(function (file) {
    const pathFile = path.join(PATH, file);
    if (fs.statSync(pathFile).isDirectory()) {
      repositories[file] = loadRepositories(pathFile, models, Sequelize, opts);
    } else {
      file = file.replace('.js', '');
      repositories[file] = require(pathFile)(models, Sequelize);
    }
  });

  return repositories;
}

const pk = {
  primaryKey   : true,
  type         : Sequelize.UUID,
  defaultValue : Sequelize.UUIDV4,
  xlabel       : 'ID'
};

const timestamps = {
  userCreated: {
    type         : Sequelize.UUID,
    defaultValue : Sequelize.UUIDV4,
    allowNull    : false,
    label        : lang.t('fields.userCreated'),
    field        : '_user_created'
  },
  userUpdated: {
    type         : Sequelize.UUID,
    defaultValue : Sequelize.UUIDV4,
    label        : lang.t('fields.userUpdated'),
    field        : '_user_updated'
  },
  userDeleted: {
    type         : Sequelize.UUID,
    defaultValue : Sequelize.UUIDV4,
    label        : lang.t('fields.userDeleted'),
    field        : '_user_deleted'
  },
  createdAt: {
    type         : Sequelize.DATE,
    allowNull    : false,
    defaultValue : Sequelize.NOW,
    xlabel       : lang.t('fields.createdAt'),
    field        : '_created_at',
    get          : function () {
      if (this.getDataValue('createdAt')) {
        return moment(this.getDataValue('createdAt')).format('DD-MM-YYYY HH:mm:ss');
      }
      return null;
    }
  },
  updatedAt: {
    type   : Sequelize.DATE,
    xlabel : lang.t('fields.updatedAt'),
    field  : '_updated_at',
    get    : function () {
      if (this.getDataValue('updatedAt')) {
        return moment(this.getDataValue('updatedAt')).format('DD-MM-YYYY HH:mm:ss');
      }
      return null;
    }
  },
  deletedAt: {
    type   : Sequelize.DATE,
    xlabel : lang.t('fields.deletedAt'),
    field  : '_deleted_at',
    get    : function () {
      if (this.getDataValue('deletedAt')) {
        return moment(this.getDataValue('deletedAt')).format('DD-MM-YYYY HH:mm:ss');
      }
      return null;
    }
  }
};

function setTimestamps (fields) {
  return Object.assign(fields, timestamps);
}

function setTimestampsSeeder (arr, idUser = '7171272e-b31b-4c34-9220-9f535c958c5c') {
  arr.map((el, index) => {
    arr[index] = Object.assign(el, {
      _user_created : idUser,
      _created_at   : new Date(),
      _updated_at   : new Date()
    });
  });

  return arr;
}

function getQuery (options = {}, arr = []) {
  const query = {};
  if (options.limit) {
    query.limit = parseInt(options.limit);
    if (options.page) {
      query.offset = parseInt((options.page - 1) * options.limit);
    }
  }

  if (!options.order) {
    options.order = 'createdAt';
  }

  if (arr.indexOf(options.order ? options.order.replace('-', '') : null) === -1) {
    if (options.order) {
      if (options.order.startsWith('-')) {
        query.order = [
          [options.order.substring(1), 'DESC']
        ];
      } else {
        query.order = [
          [options.order, 'ASC']
        ];
      }
    }
  }
  query.order.push(['id', 'ASC']);
  return query;
}

function errorHandler (error) {
  if (error.errors) {
    const err = error.errors;
    const oError = {};
    for (const i in err) {
      const key = err[i].path;
      const type = err[i].type;
      const value = err[i].value;
      let message = '';

      if (['unique violation'].indexOf(type) !== -1) {
        if (type === 'unique violation') {
          message = `"${value}" ${lang.t('errors.validation.unique')}`;
        } else {
          message = `${type}:${err[i].message}`;
        }

        if (oError[key]) {
          oError[key].err.push(message);
        } else {
          oError[key] = {
            errors: [message]
          };
        }
        oError[key].label = lang.t(`fields.${key}`);
      } else {
        console.log('Error de Validación desconocida');
        throw new Error(error.message);
      }
    }
    if (Object.keys(oError).length) {
      throw new Error(getText(oError));
    }
  }
  throw error;
}

function getText (oError) {
  let text = '';
  for (const key in oError) {
    text += '- ' + oError[key].label + ': ' + oError[key].errors.join(', ') + '.\n';
  }
  return text;
}

function convertLinealObject (data) {
  const ob = {};
  for (const i in data) {
    for (const j in data[i]) {
      ob[j] = data[i][j];
    }
  }
  return ob;
}

function toJSON (result) {
  const rows = [];
  let count = 0;
  if (result) {
    if (result.rows && Array.isArray(result.rows)) {
      result.rows.map(item => {
        rows.push(item.toJSON());
      });
    }
    count = result.count || 0;
  }
  return {
    count,
    rows
  };
}

module.exports = {
  loadModels,
  loadRepositories,
  pk,
  timestamps,
  setTimestamps,
  setTimestampsSeeder,
  getQuery,
  errorHandler,
  getText,
  convertLinealObject,
  toJSON
};
