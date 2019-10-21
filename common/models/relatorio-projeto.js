'use strict';

module.exports = function(Relatorioprojeto) {
  function monthDiff(d1, d2) {
    var months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth() + 1;
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
  }

  // Verifica duplicação de um relatorio
  Relatorioprojeto.observe('before save', (ctx, next) => {
    if (ctx.isNewInstance) {
      Relatorioprojeto.findOne(
        {where: {projetoId: ctx.projetoId}},
        (err, obj) => {
          if (err) return next(err);

          if (obj) {
            const error = new Error();

            error.message = 'Relatório para o projeto já existente.';
            error.status = 409;

            return next(error);
          } else return next();
        }
      );
    } else return next();
  });

  // Retorna a media de acessos por mes de um projeto
  Relatorioprojeto.mediaAcessos = function(projetoId, cb) {
    Relatorioprojeto.findOne(
      {where: {projetoId: projetoId}},
      (err, relatorio) => {
        if (err) return cb(err);

        const dataAtual = Date.now();
        const dataRelatorio = relatorio.dataCriacao;

        const months = monthDiff(dataAtual, dataRelatorio);

        const media = relatorio.numeroAcessos / months;

        return cb(null, media);
      }
    );
  };

  Relatorioprojeto.remoteMethod('mediaAcessos', {
    accepts: {
      arg: 'projetoId',
      type: 'number',
      required: true,
      description: 'ID do Projeto',
    },
    returns: {arg: 'response', type: 'number', root: 'true'},
    http: {path: '/mediaAcessos', verb: 'get', status: 204},
    description: 'Retorna média de acessos por mês de um projeto.',
  });
};
