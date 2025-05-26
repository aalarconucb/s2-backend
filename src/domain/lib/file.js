const fs = require('fs').promises;
const path = require('path');

async function escribirBase64 (rutaDirectorio, nombreArchivo, documentoBase64) {
  try {
    if(!fs.access(rutaDirectorio)){
      await fs.mkdir(rutaDirectorio, {recursive: true})
    }
    const base64 = documentoBase64.replace(/^data:([A-Za-z-+/]+);base64,/, '')
    const rutaCompleta = path.join(rutaDirectorio, nombreArchivo)

    await fs.writeFile(rutaCompleta, base64, { encoding: 'base64'})
    return rutaCompleta
  } catch (error) {
    throw new Error(`Error al escribir el archivo en base64: ${error.message}`)
  }
};

function json2Csv(items) {
  if (!items || items.length === 0) {
    const message = 'No se encontraron datos para los parámetros proporcionados';
    return `${message}\r\n`;
  }

  const header = Object.keys(items[0])
  const headerString = header.join(',')

  // Manejo de valores nulos o indefinidos
  const replacer = (key, value) => value ?? ''

  // Generar las filas del CSV
  const rowItems = items.map((row) =>
    header
      .map((fieldName) => JSON.stringify(row[fieldName], replacer))
      .join(',')
  );

  // Unir encabezados y filas
  const csv = [headerString, ...rowItems].join('\r\n')
  return '\uFEFF' + csv;
}

module.exports = {
  escribirBase64,
  json2Csv
};
