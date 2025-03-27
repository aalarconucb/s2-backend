'use strict';

const { config } = require('../../common');

const configSeeder = {
  development: {
    username : config.db.username,
    password : config.db.password,
    database : config.db.database,
    host     : config.db.host,
    port     : config.db.port,
    dialect  : 'postgres',
    pool     : {
      max  : 15,
      min  : 0,
      idle : 10000
    }
  },
  test: {
    username : config.db.username,
    password : config.db.password,
    database : config.db.database,
    host     : config.db.host,
    port     : config.db.port,
    dialect  : 'postgres',
    pool     : {
      max  : 15,
      min  : 0,
      idle : 10000
    }
  },
  production: {
    username               : config.db.username,
    password               : config.db.password,
    database               : config.db.database,
    host                   : config.db.host,
    port                   : config.db.port,
    seederStorage          : 'sequelize',
    seederStorageTableName : 'sequelize_seeders',
    dialect                : 'postgres',
    pool                   : {
      max  : 15,
      min  : 0,
      idle : 10000
    }
  }
};

module.exports = configSeeder;
