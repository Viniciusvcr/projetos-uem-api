'use strict';

module.exports = function(Inscrito) {
  // Verificando duplicação de inscrição no processo seletivo;
  Inscrito.observe('before save', (ctx, next) => {
    if (ctx.isNewInstance) {
      const newInscrito = ctx.instance;
      const Discente = Inscrito.app.models.Discente;

      Inscrito.findOne(
        {where: {projetoId: newInscrito.projetoId, discenteId: newInscrito.discenteId}},
        (err, inscrito) => {
          if (err) return next(err);
          if (inscrito) {
            Discente.findById(inscrito.discenteId, (err, discente) => {
              if (err) return next(err);
              if (!discente) {
                const error = new Error();

                error.message = 'Discente não encontrado';
                error.status = 404;

                return next(error);
              } else {
                const error = new Error();

                error.message = 'Você já está inscrito no processo seletivo';
                error.status = 409;

                return next(error);
              }
            });
          } else {
            return next();
          }
        }
      );
    } else {
      return next();
    }
  });
};
