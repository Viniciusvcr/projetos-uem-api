'use strict';

module.exports = async function(app) {
  const config = require('../data/config.json');
  const boldWhite = '\x1b[1m';
  const boldRed = '\x1b[1;31m';
  const boldGreen = '\x1b[1;32m';
  const reset = '\x1b[0m';

  const informations = function() {
    const db = app.dataSources.db;

    console.log(`${boldWhite}Informações da API:${reset}`);

    console.log(`  ${boldWhite}Ambiente: ${boldRed}'${process.env.NODE_ENV}'${reset}`);
    console.log(
      // eslint-disable-next-line max-len
      `  ${boldWhite}Banco de dados: ${boldRed}'${db.connector.name}:${db.connector.settings.database}'${reset}`
    );
  };

  const upsertAdmin = async () => {
    const Usuario = app.models.Usuario;
    const RoleMapping = app.models.RoleMapping;
    const Role = app.models.Role;
    const Admin = config.admin;

    try {
      const user = await Usuario.upsertWithWhere({username: Admin.username}, Admin);
      const role = await Role.findOne({where: {name: 'admin'}});

      if (!role) {
        throw new Error('Role admin não encontrada');
      } else {
        const [instance, created] = await RoleMapping.findOrCreate(
          {where: {principalId: user.id, roleId: role.id}},
          {
            principalType: RoleMapping.USER,
            principalId: user.id,
            roleId: role.id
          }
        );

        if (created) {
          console.log(
            // eslint-disable-next-line max-len
            `    '${boldGreen}${user.username}${reset}' se tornou um '${boldGreen}${role.name}${reset}'!`
          );
        } else {
          console.log(`    Admin '${boldGreen}${user.username}${reset}' atualizado!`);
        }
      }
    } catch (err) {
      throw err;
    }
  };

  const initRoles = async () => {
    const Role = app.models.Role;
    const roles = config.roles;

    for (const role of roles) {
      try {
        const [roleInstance, roleCreated] = await Role.findOrCreate(
          {where: {name: role}},
          {name: role}
        );

        if (roleCreated) {
          console.log(`    Role '${boldGreen}${roleInstance.name}${reset}' criada!`);
        } else {
          console.log(
            `    ${boldGreen}Role '${roleInstance.name}' já existe no Banco de Dados.${reset}`
          );
        }
      } catch (err) {
        throw err;
      }
    }
  };

  const modelActions = function(model) {
    if (model === 'Role') {
      return initRoles();
    } else if (model === 'Usuario') {
      return upsertAdmin();
    }
  };

  const isActual = (dataSource, model) => {
    return new Promise((resolve, reject) => {
      dataSource.isActual(model, (err, actual) => {
        if (err) reject(err);
        resolve(actual);
      });
    });
  };

  const initDatabase = async () => {
    const mysql = app.dataSources.db;
    const models = mysql.modelBuilder.models;

    console.log();
    console.log(`${boldWhite}Atualizando automaticamente os modelos no Banco de Dados...${reset}`);

    for (const model of Object.keys(models)) {
      const modelDS = models[model].getDataSource();

      if (modelDS) {
        if (model != 'Email') {
          try {
            const actual = await isActual(mysql, model);

            if (actual) {
              console.log(
                `  ${boldWhite}Modelo '${model}' está atualizado no Banco de Dados${reset}`
              );
            } else {
              await mysql.autoupdate(model);
              console.log(`  ${boldGreen}${model} atualizado com sucesso!${reset}`);
            }

            await modelActions(model);
          } catch (err) {
            throw err;
          }
        }
      }
    }
  };

  await initDatabase();
  console.log();
  informations();
  console.log();
};
