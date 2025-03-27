// const Logs = require('app-logs');
const { config, errors } = require('../../common');
class ErrorApp extends Error {
  constructor (errorMessage, httpCode = 400, name = 'ErrorAplicacion', log = false, errorCode = 1) {
    super(errorMessage);
    this.name = name;
    this.message = errorMessage || 'Ha ocurrido un error';
    this.codigoError = errorCode || 0;
    this.httpCode = httpCode;
    this.stack = (new Error(errorMessage)).stack;
    if (log) {
      this.guardarLogs();
    }
  }

  async guardarLogs () {
    // const logs = await Logs(config.db).catch(errors.handleFatalError);
    switch (this.httpCode) {
      case 400:
        // logs.warning(this.message, this.name, this.httpCode);
        break;
      case 500:
        // logs.error(this.message, this.name, ` ${this.httpCode} ${this.stack}`);
        break;
    }
  }
}
module.exports = { ErrorApp };
