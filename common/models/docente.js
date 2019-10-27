'use strict';

const error = function(message, status) {
  const error = new Error();

  error.message = message;
  error.status = status;

  return error;
};

module.exports = function(Docente) {
  // Verificação de duplicação de matrícula
  Docente.observe('before save', (ctx, next) => {
    if (ctx.isNewInstance) {
      const newDocente = ctx.instance;
      Docente.findOne({where: {matricula: newDocente.matricula}}, (err, exists) => {
        if (err) {
          return next(err);
        }

        if (exists) {
          return next(error('Matrícula já cadastrada', 400));
        } else return next();
      });
    } else return next();
  });

  // Verificação de integridade de vencimentoContrato
  Docente.observe('before save', (ctx, next) => {
    const newDocente = ctx.isNewInstance ? ctx.instance : ctx.data ? ctx.data : ctx.instance;

    if (newDocente.vencimentoContrato) {
      const dataAtual = new Date().setHours(0, 0, 0, 0).valueOf();
      const vencimentoContrato = newDocente.vencimentoContrato.valueOf();

      if (dataAtual > vencimentoContrato) {
        return next(error('Contrato vencido com a instituição', 400));
      } else return next();
    } else return next();
  });
};
