'use strict';

module.exports = function(Inscrito) {
  // Verificando duplicação de inscrição no processo seletivo;
  Inscrito.observe('before save', (ctx, next) => {
    if (ctx.isNewInstance) {
      const newInscrito = ctx.instance;
      const Usuario = Inscrito.app.models.Usuario;

      Inscrito.findOne(
        {where: {projetoId: newInscrito.projetoId, usuarioId: newInscrito.usuarioId}},
        (err, inscrito) => {
          if (err) return next(err);
          if (inscrito) {
            Usuario.findById(inscrito.usuarioId, (err, usuario) => {
              if (err) return next(err);
              if (!usuario) {
                const error = new Error();

                error.message = 'Usuário não encontrado';
                error.status = 404;

                return next(error);
              } else {
                const error = new Error();

                error.message = `${usuario.nome} já inscrito no evento`;
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
