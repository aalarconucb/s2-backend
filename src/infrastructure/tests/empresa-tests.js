'use strict';

const test = require('ava');
const { config, errors } = require('../../common');
const db = require('../');

let repositories;

test.beforeEach(async () => {
  if (!repositories) {
    repositories = await db(config.db).catch(errors.handleFatalError);
  }
});
test.serial('== Empresa Repository - findAll', async t => {
  const { EmpresaRepository } = repositories;
  const lista = await EmpresaRepository.findAll();
  t.true(lista.count >= 0, 'Se tienen registros en la base de datos');
});
test.serial('== Empresa Repository - findFormulario', async t => {
  const { EmpresaRepository } = repositories;
  const lista = await EmpresaRepository.findFormulario(73);
  t.true(lista.count >= 0, 'Se tienen registros en la base de datos');
});
