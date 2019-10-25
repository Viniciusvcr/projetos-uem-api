'use strict';

module.exports = function(app) {
  const config = require('../data/config.json');

  const informations = function() {
    const boldWhite = '\x1b[1m';
    const boldRed = '\x1b[1;31m';
    const reset = '\x1b[0m';
    const db = app.dataSources.db;
    // const email =
    //   app.dataSources.email.connector.dataSource.settings.transports[0];

    console.log(`${boldWhite}Ambiente: ${boldRed}'${process.env.NODE_ENV}'${reset}`);
    console.log(
      // eslint-disable-next-line max-len
      `${boldWhite}Banco de dados: ${boldRed}'${db.connector.name}:${db.connector.settings.database}'${reset}`
    );
    // console.log(
    //   `${boldWhite}Email: ${boldRed}'${email.host.split('.')[1]}:${
    //     email.auth.user
    //   }'${reset}`
    // );
  };

  const upsertAdmin = function() {
    const Usuario = app.models.Usuario;
    const RoleMapping = app.models.RoleMapping;
    const Role = app.models.Role;
    const Admin = config.admin;

    Usuario.upsertWithWhere({username: Admin.username}, Admin, (err, user) => {
      if (err) {
        throw err;
      }

      Role.findOne({where: {name: 'admin'}}, (err, role) => {
        if (err) {
          throw err;
        }

        if (!role) {
          throw new Error('Role admin não encontrada');
        } else {
          RoleMapping.findOrCreate(
            {where: {principalId: user.id, roleId: role.id}},
            {
              principalType: RoleMapping.USER,
              principalId: user.id,
              roleId: role.id
            },
            (err, instance, created) => {
              if (err) {
                throw err;
              }

              if (created) {
                console.log(`    ${user.username} se tornou um ${role.name}!`);
              } else {
                console.log(`    Admin ${user.username} atualizado!`);
              }
            }
          );
        }
      });
    });
  };

  const initRoles = function() {
    const Role = app.models.Role;
    const roles = config.roles;

    roles.forEach(actual => {
      Role.findOrCreate(
        {where: {name: actual}},
        {name: actual},
        (err, roleInstance, roleCreated) => {
          if (err) throw err;

          if (roleCreated) {
            console.log(`    Role "${roleInstance.name}" criada!`);
          } else {
            console.log(`    "${roleInstance.name}" já existe no Banco de Dados.`);
          }
        }
      );
    });
  };

  const modelActions = function(model) {
    if (model === 'Role') {
      initRoles();
    } else if (model === 'Usuario') {
      upsertAdmin();
    }
  };

  const initDatabase = function() {
    const mysql = app.dataSources.db;
    const models = mysql.modelBuilder.models;

    Object.keys(models).forEach(model => {
      const modelDs = models[model].getDataSource();

      if (modelDs) {
        if (model != 'Email') {
          mysql.isActual(model, (err, actual) => {
            if (err) throw err;

            if (actual) {
              console.log(`  Modelo "${model}" está atualizado no Banco de Dados`);
              modelActions(model);
            } else {
              mysql.autoupdate(model, (err, result) => {
                if (err) throw err;

                modelActions(model);
                console.log(`  '${model}' atualizado com sucesso!`);
              });
            }
          });
        }
      }
    });
  };

  informations();
  initDatabase();
};
