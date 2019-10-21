'use strict';

module.exports = function(Relatorioprojeto) {
  function monthDiff(d1, d2) {
    var months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth() + 1;
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
  }

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
