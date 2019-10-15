'use strict';

const verifyEmail = require('isemail');

const error = function(message, status) {
  const error = new Error();

  error.message = message;
  error.status = status;

  return error;
};

module.exports = function(Usuario) {
  Usuario.observe('before save', (ctx, next) => {
    const newUsuario = ctx.isNewInstance ?
      ctx.instance :
      ctx.data ?
      ctx.data :
      ctx.instance;

    if (!verifyEmail.validate(newUsuario.email)) {
      return next(error('Email inválido', 400));
    } else return next();
  });
};
