'use strict';

const { errorHandler } = require('../lib/util');

async function createOrUpdate (object, model, t) {
  const cond = {
    where: {
      id: object.id || null
    }
  };

  const item = await model.findOne(cond);

  if (item) {
    object.updatedAt = new Date();
    let updated;
    try {
      if (t) {
        cond.transaction = t;
      }
      delete object.createdAt;
      delete object.userCreated;

      updated = await model.update(object, cond);
    } catch (e) {
      if (t) {
        await t.rollback();
      }
      errorHandler(e);
    }

    const result = updated ? await model.findOne(cond) : item;

    if (result) {
      return result.toJSON();
    }
    return null;
  }

  let result;
  try {
    object.createdAt = new Date();
    result = await model.create(object, t ? { transaction: t } : {});
  } catch (e) {
    if (t) {
      await t.rollback();
    }
    errorHandler(e);
  }

  return result.toJSON();
}

async function findById (id, model, attributes = []) {
  const query = {};
  query.where = {};
  query.where.id = id;
  if (attributes.length) {
    query.attributes = attributes;
  }
  try {
    const result = await model.findOne(query);
    if (result) {
      return result.toJSON();
    }
    return null;
  } catch (err) {
    errorHandler(err);
  }
}

async function deleteItem (id, model, t) {
  const cond = {
    where: {
      id
    }
  };
  if (t) {
    cond.transaction = t;
  }
  try {
    const item = await model.findOne(cond);

    if (item) {
      const deleted = await model.destroy(cond);
      return +!!deleted; //  Devuelve 1 si se eliminó correctamente y 0 si no se pudo eliminar
    }
  } catch (e) {
    if (t) {
      await t.rollback();
    }
    throw new Error(e);
  }

  return -1; // Devuelve -1 si no se encontró el registro
}

async function findOne (params, model) {
  const result = await model.findOne({
    where: params
  });

  if (result) {
    return result.toJSON();
  }
  return null;
}
async function inactivateItem (id, model, object) {
  const cond = {
    where: {
      id
    }
  };
  if (object && !object.updatedAt) {
    object.updatedAt = new Date();
  }
  try {
    const item = await model.findOne(cond);
    if (item) {
      if (item.estado === 'INACTIVO') {
        throw new Error('El registro ya se encuentra eliminado');
      }
      const updated = await model.update(object, cond);
      return +!!updated; //  Devuelve 1 si se eliminó correctamente y 0 si no se pudo eliminar
    }
  } catch (e) {
    throw new Error(e);
  }
  return -1; // Devuelve -1 si no se encontró el registro
}

async function deleteItemCond (params, model, t) {
  const actualizacion = {
    userDeleted : params.userDeleted,
    deletedAt   : new Date()
  };

  delete params.userDeleted;

  const cond = {
    where: params
  };

  if (t) {
    cond.transaction = t;
  }
  try {
    const deleted = await model.update(actualizacion, cond);
    return deleted; //  Devuelve 1 si se eliminó correctamente y 0 si no se pudo eliminar
  } catch (e) {
    if (t) {
      await t.rollback();
    }
    throw new Error(e);
  }
}
module.exports = {
  deleteItemCond,
  findOne,
  deleteItem,
  inactivateItem,
  createOrUpdate,
  findById
};
