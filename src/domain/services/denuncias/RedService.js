const { ErrorApp } = require('../../lib/error');

module.exports = function redService (repositories) {
  const { RedRepository } = repositories;

  async function createOrUpdate (data) {
    try {
      const red = await RedRepository.createOrUpdate(data);
      return red;
    } catch (error) {
      throw new ErrorApp(error.message, 400);
    }
  }

  async function listar (params) {
    try {
      const redes = await RedRepository.listar(params);
      return redes;
    } catch (err) {
      throw new ErrorApp(err.message, 400);
    }
  }
  return {
    createOrUpdate,
    listar
  };
};
