const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);

function formatearFecha (fecha) {
  return dayjs(fecha, 'DD/MM/YYYY').format('YYYY-MM-DD');
}

function formatearFechaVista (fecha) {
  return dayjs(fecha, 'YYYY-MM-DD').format('DD/MM/YYYY');
}


function obtenerFechaActual () {
  return dayjs().format('DD/MM/YYYY HH:mm:ss');
}

module.exports = {
  obtenerFechaActual,
  formatearFecha,
  formatearFechaVista
};
