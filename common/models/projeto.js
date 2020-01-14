"use strict";

module.exports = function(Projeto) {
  // Verifica se a data de termino não antecede a data de inicio
  Projeto.observe("before save", (ctx, next) => {
    if (ctx.isNewInstance) {
      const newProjeto = ctx.instance;

      if (!newProjeto.dataTermino) {
        return next();
      } else {
        const dataInicio = newProjeto.dataInicio.valueOf();
        const dataTermino = newProjeto.dataTermino.valueOf();

        if (dataInicio > dataTermino) {
          const error = new Error();

          error.message = "Data de término antecede data de início.";
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

          error.message = "Data de término antecede data de início.";
          error.status = 400;

          return next(error);
        } else return next();
      }
      return next();
    }
  });

  // Verifica se o numero atual de participantes respeita o limite maximo
  Projeto.observe("before save", (ctx, next) => {
    if (ctx.isNewInstance) {
      const newProjeto = ctx.instance;

      if (!newProjeto.limiteParticipantes) {
        return next();
      } else {
        const limiteParticipantes = newProjeto.limiteParticipantes;
        const atualParticipantes = newProjeto.atualParticipantes;

        if (atualParticipantes > limiteParticipantes) {
          const error = new Error();

          error.message =
            "Quantidade atual de participantes excede o limite permitido.";
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

          error.message =
            "Quantidade atual de participantes excede o limite permitido.";
          error.status = 400;

          return next(error);
        } else return next();
      } else return next();
    }
  });

  // Verifica se o Docente existe
  Projeto.observe("before save", async (ctx, next) => {
    if (ctx.isNewInstance) {
      const newProjeto = ctx.instance;
      const Docente = Projeto.app.models.Docente;

      try {
        console.log("DOCENTE ", newProjeto.docenteId);
        const docenteProjeto = await Docente.findById(newProjeto.docenteId);

        if (docenteProjeto) return;

        const error = new Error();
        next();

        error.status = 404;
        error.message = "Docente não encontrado.";

        throw error;
      } catch (err) {
        throw err;
      }
    } else {
      const docenteId = ctx.data.docenteId;

      if (docenteId) {
        const Docente = Projeto.app.models.Docente;

        try {
          const docenteProjeto = await Docente.findById(docenteId);

          if (docenteProjeto) return;

          const error = new Error();

          error.status = 404;
          error.message = "Docente não encontrado.";

          throw error;
        } catch (err) {
          throw err;
        }
      }
      return;
    }
  });

  // Verifica se a Area existe
  Projeto.observe("before save", async (ctx, next) => {
    if (ctx.isNewInstance) {
      const newProjeto = ctx.instance;
      const Area = Projeto.app.models.Area;

      try {
        console.log("AREA ", newProjeto.areaId);
        const areaProjeto = await Area.findById(newProjeto.areaId);

        if (areaProjeto) return;

        const error = new Error();

        error.status = 404;
        error.message = "Area não encontrada";

        throw error;
      } catch (err) {
        throw err;
      }
    } else {
      const areaId = ctx.data.areaId;

      if (areaId) {
        const Area = Projeto.app.models.Area;

        try {
          const areaProjeto = await Area.findById(areaId);

          if (areaProjeto) return;

          const error = new Error();

          error.status = 404;
          error.message = "Area não encontrada.";

          throw error;
        } catch (err) {
          throw err;
        }
      } else return;
    }
  });

  // Verifica se a Subarea existe
  Projeto.observe("before save", async (ctx, next) => {
    if (ctx.isNewInstance) {
      const newProjeto = ctx.instance;
      const Subarea = Projeto.app.models.Subarea;

      try {
        console.log("SUBAREA ", newProjeto.subareaId);
        const subareaProjeto = await Subarea.findById(newProjeto.subareaId);

        if (subareaProjeto) return;

        const error = new Error();

        error.status = 404;
        error.message = "Subarea não encontrada";

        throw error;
      } catch (err) {
        throw err;
      }
    } else {
      const subareaId = ctx.data.subareaId;

      if (subareaId) {
        const Subarea = Projeto.app.models.Subarea;

        try {
          const subareaProjeto = await Subarea.findById(subareaId);

          if (subareaProjeto) return;

          const error = new Error();

          error.status = 404;
          error.message = "Subarea não encontrada.";

          throw error;
        } catch (err) {
          throw err;
        }
      } else return;
    }
  });

  // Cria o modelo do relatorio para o projeto instanciado
  Projeto.afterRemote("create", (ctx, projetoInstance, next) => {
    const relatorioProjeto = Projeto.app.models.relatorioProjeto;

    const dataAtual = Date.now();
    relatorioProjeto.create(
      {
        dataCriacao: dataAtual,
        projetoId: projetoInstance.id,
        docenteId: projetoInstance.docenteId
      },
      (err, obj) => {
        if (err) return next(err);

        return next();
      }
    );
  });

  // Incremento do número de acessos para o projeto
  Projeto.afterRemote("findById", (ctx, projetoInstance, next) => {
    const relatorioProjeto = Projeto.app.models.relatorioProjeto;

    relatorioProjeto.findOne(
      { where: { projetoId: projetoInstance.id } },
      (err, relatorio) => {
        if (err) return next(err);

        relatorio.updateAttribute(
          "numeroAcessos",
          relatorio.numeroAcessos + 1,
          (err, updatedRelatorio) => {
            if (err) return next(err);
            else return next();
          }
        );
      }
    );
  });
};
