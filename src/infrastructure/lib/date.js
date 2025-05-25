const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);

function formatearFecha (fecha) {
  return dayjs(fecha, 'DD/MM/YYYY').format('YYYY-MM-DD');
}

function formatearFechaHora (fecha) {
  return dayjs(fecha, 'DD/MM/YYYY HH:mm').format('YYYY-MM-DD HH:mm');
}

function armarFecha (fecha) {
  return dayjs(fecha).format('DD/MM/YYYY');
}

function armarFechaHora (fecha) {
  return dayjs(fecha).format('DD/MM/YYYY HH:mm');
}

module.exports = {
  formatearFecha,
  armarFecha,
  formatearFechaHora,
  armarFechaHora
};
