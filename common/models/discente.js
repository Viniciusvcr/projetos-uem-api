'use strict';

const error = function(message, status) {
  const error = new Error();

  error.message = message;
  error.status = status;

  return error;
};

module.exports = function(Discente) {
  // Verificação de duplicação de RA
  Discente.observe('before save', (ctx, next) => {
    if (ctx.isNewInstance) {
      const newDiscente = ctx.instance;

      Discente.findOne({where: {ra: newDiscente.ra}}, (err, exists) => {
        if (err) {
          return next(err);
        }

        if (exists) {
          return next(error('RA já cadastrado', 400));
        } else return next();
      });
    } else return next();
  });

  // Verificação de integridade do atributo situacaoAcademica
  Discente.observe('before save', (ctx, next) => {
    const situacoesAceitas = ['MATRICULADO', 'TRANCADO', 'DESISTENTE'];
    const newDiscente = ctx.isNewInstance ? ctx.instance : ctx.data ? ctx.data : ctx.instance;

    if (situacoesAceitas.includes(newDiscente.situacaoAcademica.toUpperCase())) {
      return next();
    } else return next(error('Situação acadêmica desconhecida', 400));
  });
};
