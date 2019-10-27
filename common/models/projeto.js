'use strict';

module.exports = function(Projeto) {
  // Verifica se a data de termino não antecede a data de inicio
  Projeto.observe('before save', (ctx, next) => {
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
      if (ctx.data.dataInicio && ctx.data.dataInicio) {
        const dataInicio = ctx.data.dataInicio.valueOf();
        const dataTermino = ctx.data.dataTermino.valueOf();

        if (dataInicio > dataTermino) {
          const error = new Error();

          error.message = 'Data de término antecede data de início.';
          error.status = 400;

          return next(error);
        } else return next();
      }
      return next();
    }
  });

  // Verifica se o numero atual de participantes respeita o limite maximo
  Projeto.observe('before save', (ctx, next) => {
    if (ctx.isNewInstance) {
      const newProjeto = ctx.instance;

      if (!newProjeto.limiteParticipantes) {
        return next();
      } else {
        const limiteParticipantes = newProjeto.limiteParticipantes;
        const atualParticipantes = newProjeto.atualParticipantes;

        if (atualParticipantes > limiteParticipantes) {
          const error = new Error();

          error.message = 'Quantidade atual de participantes excede o limite permitido.';
          error.status = 400;

          return next(error);
        } else return next();
      }
    } else {
      const limiteParticipantes = ctx.data.limiteParticipantes;
      const atualParticipantes = ctx.data.atualParticipantes;

      if (limiteParticipantes) {
        if (atualParticipantes > limiteParticipantes) {
          const error = new Error();

          error.message = 'Quantidade atual de participantes excede o limite permitido.';
          error.status = 400;

          return next(error);
        } else return next();
      } else return next();
    }
  });

  // Verifica se o Docente existe
  Projeto.observe('before save', async (ctx, next) => {
    if (ctx.isNewInstance) {
      const newProjeto = ctx.instance;
      const Docente = Projeto.app.models.Docente;

      try {
        const docenteProjeto = await Docente.findById(newProjeto.docenteId);

        if (docenteProjeto) return next();

        const error = new Error();

        error.status = 404;
        error.message = 'Docente não encontrado.';

        return next(error);
      } catch (err) {
        return next(err);
      }
    }
  });

  // Cria o modelo do relatorio para o projeto instanciado
  Projeto.afterRemote('create', (ctx, projetoInstance, next) => {
    const relatorioProjeto = Projeto.app.models.relatorioProjeto;

    const dataAtual = Date.now();
    relatorioProjeto.create({dataCriacao: dataAtual, projetoId: projetoInstance.id}, (err, obj) => {
      if (err) return next(err);

      return next();
    });
  });

  // Incremento do número de acessos para o projeto
  Projeto.afterRemote('findById', (ctx, projetoInstance, next) => {
    const relatorioProjeto = Projeto.app.models.relatorioProjeto;

    relatorioProjeto.findOne({where: {projetoId: projetoInstance.id}}, (err, relatorio) => {
      if (err) return next(err);

      relatorio.updateAttribute(
        'numeroAcessos',
        relatorio.numeroAcessos + 1,
        (err, updatedRelatorio) => {
          if (err) return next(err);
          else return next();
        }
      );
    });
  });
};
