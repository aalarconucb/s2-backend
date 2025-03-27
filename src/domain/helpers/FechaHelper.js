'use strict';
const moment = require('moment');

module.exports = function setupFecha () {
  function formatearFecha (fecha, formatoFinal = 'YYYY-MM-DD') {
    if (!fecha) {
      return '';
    }
    let formatoInicial = 'DD/MM/YYYY';
    // Regexp para fechas en formado DD/MM/YYYY   [0-9]{2}\/[0-9]{2}\/[0-9]{4}
    if (/[0-9]{2}\/[0-9]{2}\/[0-9]{4}/.test(fecha)) {
      formatoInicial = 'DD/MM/YYYY';
    }

    // Regexp para fechas en formado DD-MM-YYY   [0-9]{4}\/[0-9]{2}\/[0-9]{2}
    if (/[0-9]{2}-[0-9]{2}-[0-9]{4}/.test(fecha)) {
      formatoInicial = 'DD-MM-YYYY';
    }

    // Regexp para fechas en formado YYYY/MM/DD   [0-9]{4}\/[0-9]{2}\/[0-9]{2}
    if (/[0-9]{4}\/[0-9]{2}\/[0-9]{2}/.test(fecha)) {
      formatoInicial = 'YYYY/MM/DD';
    }

    // Regexp para fechas en formado YYYY-MM-DD   [0-9]{4}\/[0-9]{2}\/[0-9]{2}
    if (/[0-9]{4}-[0-9]{2}-[0-9]{2}/.test(fecha)) {
      return fecha;
    }
    return moment(fecha, formatoInicial).format(formatoFinal);
  }

  return {
    formatearFecha
  };
};
