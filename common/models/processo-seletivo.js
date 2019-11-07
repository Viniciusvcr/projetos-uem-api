'use strict';
const error = function(message, status) {
  const error = new Error();

  error.message = message;
  error.status = status;

  return error;
};

module.exports = function(Processoseletivo) {
  Processoseletivo.observe('before save', (ctx, next) => {
    const newProcessoSeletivo = ctx.isNewInstance ?
      ctx.instance :
      ctx.data ?
      ctx.data :
      ctx.instance;

    if (newProcessoSeletivo.dataInicio) {
      const dataAtual = new Date().setHours(0, 0, 0, 0).valueOf();
      const dataInicio = newProcessoSeletivo.dataInicio.valueOf();

      if (dataAtual > dataInicio) {
        return next(
          error('O processo seletivo não pode ser anteiror a data atual', 400)
        );
      } else return next();
    } else return next();
  });
};
