'use strict';

const verifyEmail = require('isemail');

const error = function(message, status) {
  const error = new Error();

  error.message = message;
  error.status = status;

  return error;
};

module.exports = function(Usuario) {
  // Verifica se o email fornecido tem a forma de um email
  Usuario.observe('before save', (ctx, next) => {
    const newUsuario = ctx.isNewInstance ? ctx.instance : ctx.data ? ctx.data : ctx.instance;

    if (newUsuario.email) {
      if (!verifyEmail.validate(newUsuario.email)) {
        return next(error('Email inválido', 400));
      } else return next();
    } else return next();
  });

  // Verifica a integridade do atributo Realm
  Usuario.observe('before save', (ctx, next) => {
    const newUsuario = ctx.isNewInstance ? ctx.instance : ctx.data ? ctx.data : ctx.instance;
    const roles = require('../../server/data/config.json').roles;

    if (newUsuario.realm) {
      if (roles.includes(newUsuario.realm)) {
        return next();
      } else return next(error('Realm não encontrada', 404));
    } else return next();
  });

  // Verifica a existência do Docente/Discente antes de criar o Usuário
  Usuario.observe('before save', (ctx, next) => {
    const Docente = Usuario.app.models.Docente;
    const Discente = Usuario.app.models.Discente;
    const newUsuario = ctx.isNewInstance ? ctx.instance : ctx.data ? ctx.data : ctx.instance;

    if (newUsuario.realm == 'Docente') {
      if (newUsuario.docenteId) {
        Docente.findById(newUsuario.docenteId, (err, exists) => {
          if (err) {
            return next(err);
          }

          if (exists) {
            return next();
          } else return next(error('Cadastro do Docente não encontrado!', 404));
        });
      } else return next(error('docenteId faltando na requisição', 400));
    } else if (newUsuario.realm == 'Discente') {
      if (newUsuario.discenteId) {
        Discente.findById(newUsuario.discenteId, (err, exists) => {
          if (err) {
            return next(err);
          }

          if (exists) {
            return next();
          } else return next(error('Cadastro do Discente não encontrado!', 404));
        });
      } else return next(error('discenteId faltando na requisição', 400));
    } else return next(); // 'Administrador' e 'Normal' não tem modelo adicional
  });

  // Aplica a função passada no cadastro
  Usuario.observe('after save', (ctx, next) => {
    if (ctx.isNewInstance) {
      const Role = Usuario.app.models.Role;
      const RoleMapping = Usuario.app.models.RoleMapping;

      const user = ctx.instance;
      const realmName = user.realm;
      const id = user.id;

      Role.findOne({where: {name: realmName}}, (err, role) => {
        if (err) return next(err);

        RoleMapping.findOrCreate(
          {where: {principalType: RoleMapping.USER, principalId: id}},
          {
            principalType: RoleMapping.USER,
            principalId: id,
            roleId: role.id
          },
          (err, mapInstance, created) => {
            if (err) return next(err);

            if (!created) {
              mapInstance.roleId = role.id;
              mapInstance.save();
            }

            user.realm = realmName;
            user.save((err, instance) => {
              if (err) return next(err);
              return next();
            });
          }
        );
      });
    } else return next();
  });
};
