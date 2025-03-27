'use strict';

const t = require('ava');
const common = require('../');
const { config } = common;

t('Config DB', t => {
  const { db } = config;

  // Probando configuración de bd
  t.not(db.database, null);
  t.not(db.username, null);
  t.not(db.password, null);
  t.not(db.host, null);
});
