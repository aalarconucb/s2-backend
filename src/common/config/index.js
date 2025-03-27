'use strict';

const db = require('./db');
const mail = require('./mail');
const auth = require('./auth');
const constants = require('./constants');
const openid = require('./openid');
const app = require('./app');

module.exports = {
  db,
  mail,
  auth,
  constants,
  openid,
  app
};
