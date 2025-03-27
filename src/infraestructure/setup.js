'use strict';

const minimist = require('minimist');
const inquirer = require('inquirer');
const { errors, config } = require('../common');
const db = require('./');

const args = minimist(process.argv);
const prompt = inquirer.createPromptModule();

async function setup () {
  if (!args.yes) {
    const answer = await prompt([
      {
        type    : 'confirm',
        name    : 'setup',
        message : `¿Realmente quiere destruir y crear de nuevo la base de datos "${config.db.database}" de la aplicación?`
      }
    ]);

    if (!answer.setup) {
      return console.log('Nothing happened :)');
    }
  }

  const configDB = config.db;
  configDB.setup = true; // Forzamos que la base de datos se cree desde cero

  await db(configDB).catch(errors.handleFatalError);

  configDB.force = true;

  console.log('Success Infrastructure setup!');
  process.exit(0);
}

setup();
