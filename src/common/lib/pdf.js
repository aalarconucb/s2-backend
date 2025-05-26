'use strict';
const fs = require('fs');
const util = require('util');
const path = require('path');
const hbs = require('handlebars');
const htmlPDF = require('puppeteer-html-pdf');
const readFile = util.promisify(fs.readFile);

// async function makePdf (nameTemplate, pdfData, headerTemplateFile = null, footerTemplateFile = null) {

//   // Lectura condicional de la plantilla de encabezado.
//   const headerTemplate = headerTemplateFile !== null
//     ? headerTemplateFile
//     : '<span></span>';

//     // Lectura condicional de la plantilla de pie de página.

//     // Calcular la fecha de impresión incluyendo horas y minutos
//   const now = new Date();
//   const printDate = now.toLocaleString('es-ES', {
//     year: 'numeric',
//     month: 'long',
//     day: 'numeric',
//     hour: '2-digit',
//     minute: '2-digit'
//   });
//   const footerTemplate = footerTemplateFile !== null
//     ? footerTemplateFile
//     : `
//       <div style="font-size:8px; width:100%; display:flex; justify-content:space-between; padding-left:1.7cm; padding-right:1.7cm; position: relative; bottom: 25px;">
//         <div style="display: flex; flex-direction: column; align-items: flex-start;">
//           <span>Usuario impresión: ${pdfData.usuario.nombres} ${pdfData.usuario.primerApellido} ${pdfData.usuario.segundoApellido}</span>
//           <span>Fecha impresión: ${printDate}</span>
//         </div>
//         <span class="pageNumber"></span>
//       </div>
//     `;

//   const options = {
//     format : 'Letter',
//     // margin : {
//     //   left   : '35px',
//     //   right  : '35px',
//     //   top    : '35px',
//     //   bottom : '50px'
//     // }
//     margin: {
//       top: '3cm',       // Margen superior
//       bottom: '2.5cm',    // Margen inferior
//       left: '3cm',        // Margen izquierdo
//       right: '2cm'        // Margen derecho
//     },
//     displayHeaderFooter: true, // Habilitar encabezado y pie de página
//     headerTemplate: headerTemplate,
//     footerTemplate: footerTemplate,

//     // headerTemplate: '<span></span>',
//     // footerTemplate: `
//     //   <div style="font-size:9px; width:100%; text-align:right; padding-right:1.7cm; position: relative; bottom: 25px;">
//     //     <span class="pageNumber"></span>
//     //   </div>
//     // `,

//   };

async function makePdf (nameTemplate, pdfData, tipoPlantilla = null) {
  let headerTemplate = '<span></span>'
  let footerTemplate = `
        <div style="font-size:8px; width:100%; display:flex; justify-content:space-between; padding-left:1.7cm; padding-right:1.7cm; position: relative; bottom: 25px;">
        <span class="pageNumber"></span>
      </div>
    `

  if (tipoPlantilla === 'reportes'){
    headerTemplate = cabeceraReportesNacionalDepartamental()
    footerTemplate = piePaginaReportesNacionalDepartamental(pdfData.usuario)
  }

  const options = {
    format : 'Letter',
    margin: {
      top: '3cm',       // Margen superior
      bottom: '2.5cm',  // Margen inferior
      left: '3cm',      // Margen izquierdo
      right: '2cm'      // Margen derecho
    },
    displayHeaderFooter: true, // Habilita encabezado y pie de página
    headerTemplate: headerTemplate,
    footerTemplate: footerTemplate,
    // Habilitar variables de paginación total
      footerTemplateParams: {
        totalPages: '<span class="totalPages"></span>'
    }
  };

  const html = await readFile(path.join(__dirname, `/templates/${nameTemplate}`), 'utf8');

  hbs.registerHelper('validarNulo', function (aString) {
    return aString || new hbs.SafeString('<span>&ThinSpace;</span>');
  });
  hbs.registerHelper('validarDistinto', function (tipoDenunciado, valor) {
    return tipoDenunciado !== valor;
  });
  hbs.registerHelper('esIgual', function (valor1, valor2) {
    return valor1 === valor2;
  });
  hbs.registerHelper('convertirArregloEnCadena', function (arregloDatos) {
    if (arregloDatos && arregloDatos.length > 0) {
      let cadena = '';
      for (const item of arregloDatos) {
        cadena = `${cadena}(${item.nombre})`;
      }
      return cadena;
    }
    return new hbs.SafeString('<span>&ThinSpace;</span>');
  });

  hbs.registerHelper('getIndex', function (context, ndx) {
    return context[ndx];
  });

  const template = hbs.compile(html);
  const content = template(pdfData);

  const buffer = await htmlPDF.create(content, options);

  return buffer;
}

function cabeceraReportesNacionalDepartamental() {
  const logoPath = path.join(__dirname, '../../../public/images/logo_vio_cabecera.png');
  const base64Logo = fs.readFileSync(logoPath, 'base64');
  return `
      <div style="width:100%; text-align:center; padding:10px;">
        <img
          src="data:image/png;base64,${base64Logo}"
          alt="Logo Vio"
          style="max-width:380px;"
        >
      </div>
    `;
}

function piePaginaReportesNacionalDepartamental(usuario) {
  const now = new Date();
  const printDate = now.toLocaleString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  return `
      <div style="font-size:8px; width:100%; display:flex; justify-content:space-between; padding-left:1.7cm; padding-right:1.7cm; position: relative; bottom: 25px; flex-wrap: wrap;">
        <div style="display: flex; flex-direction: column; align-items: flex-start;">
          <span>Elaborado por: ${usuario.nombres} ${usuario.primerApellido} ${usuario.segundoApellido}</span>
          <span>Fecha del reporte: ${printDate}</span>
        </div>
        <div style="text-align:right;">
          <span>Página </span>
          <span class="pageNumber"></span>
          <span> de </span>
          <span class="totalPages"></span>
        </div>
      </div>
    `;
}

module.exports = {
  makePdf
};
