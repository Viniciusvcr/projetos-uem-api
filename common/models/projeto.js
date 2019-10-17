'use strict';

module.exports = function(Projeto) {
  // Verifica se a data de termino não antecede a data de inicio
  Projeto.observe('before-save', (ctx, next) => {
    if (ctx.isNewInstance) {
      const newProjeto = ctx.instance;

      if (!newProjeto.dataTermino) {
        return next();
      } else {
        const dataInicio = newProjeto.dataInicio.valueOf();
        const dataTermino = newProjeto.dataTermino.valueOf();

        if (dataInicio > dataTermino) {
          const error = new Error();

          error.message = 'Data de término antecede data de início.';
          error.status = 400;

          return next(error);
        } else return next();
      }
    } else {
      const dataInicio = ctx.data.dataInicio.valueOf();
      const dataTermino = ctx.data.dataTermino.valueOf();

      if (dataInicio > dataTermino) {
        const error = new Error();

        error.message = 'Data de término antecede data de início.';
        error.status = 400;

        return next(error);
      } else return next();
    }
  });
};
