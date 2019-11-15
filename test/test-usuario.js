"use strict";

// Desenvolvedor: Vinícius Regatieri

const request = require("request");
const rp = require("request-promise-native");
const expect = require("chai").expect;

const baseUrl = "http://localhost:3001/api";

const postTest = {
  nome: "Vinícius",
  realm: "Normal",
  username: "teste",
  email: "teste@teste.com",
  password: "123",
  emailVerified: false
};

const emailInvalidoTest = {
  nome: "Vinícius",
  realm: "Normal",
  username: "teste",
  email: "naoeumemail",
  password: "123"
};

const updateTest = {
  nome: "Vinícius Regatieri",
  realm: "Normal",
  username: "teste",
  email: "teste@teste.com",
  password: "123",
  emailVerified: false
};

const roleTest = {
  nome: "Vinícius Regatieri",
  realm: "RoleInexistente",
  username: "teste",
  email: "teste@teste.com",
  password: "123",
  emailVerified: false
};

describe("Modelo Usuário", () => {
  describe("Testes CRUD", () => {
    it("Deveria criar um novo usuário e retornar status 200", done => {
      request.post(
        {
          headers: { "content-type": "application/json" },
          url: `${baseUrl}/Usuarios`,
          body: JSON.stringify(postTest)
        },
        (error, response, body) => {
          const obj = JSON.parse(response.body);

          postTest["id"] = obj.id;
          expect(response.statusCode).to.equal(200);
          expect(obj.nome).to.equal("Vinícius");
          expect(obj.realm).to.equal("Normal");
          expect(obj.username).to.equal("teste");
          expect(obj.email).to.equal("teste@teste.com");
          expect(obj.emailVerified).to.equal(false);
          done();
        }
      );
    });

    it("Deveria retornar status 200 e atualizar atributos ao atualizar um Usuário", done => {
      request.post(
        {
          headers: {
            "content-type": "application/json"
          },
          url: `${baseUrl}/Usuarios/login`,
          body: JSON.stringify({
            username: postTest.username,
            password: postTest.password
          })
        },
        (error, response, body) => {
          const obj = JSON.parse(response.body);
          request.patch(
            {
              headers: {
                "content-type": "application/json",
                Accept: "application/json"
              },
              url: `${baseUrl}/Usuarios/${obj.userId}?access_token=${obj.id}`,
              body: JSON.stringify(updateTest)
            },
            (error, responsePatch, body) => {
              const obj = JSON.parse(responsePatch.body);
              expect(responsePatch.statusCode).to.equal(200);
              expect(obj.nome).to.equal("Vinícius Regatieri");
              expect(obj.realm).to.equal("Normal");
              expect(obj.username).to.equal("teste");
              expect(obj.email).to.equal("teste@teste.com");
              expect(obj.emailVerified).to.equal(false);
              done();
            }
          );
        }
      );
    });

    it("Deveria retornar status 200 o Usuário cadastrado nos testes", done => {
      request.post(
        {
          headers: {
            "content-type": "application/json"
          },
          url: `${baseUrl}/Usuarios/login`,
          body: JSON.stringify({
            username: postTest.username,
            password: postTest.password
          })
        },
        (error, response, body) => {
          const obj = JSON.parse(response.body);
          request.get(
            {
              headers: {
                "content-type": "application/json",
                Accept: "application/json"
              },
              url: `${baseUrl}/Usuarios/${obj.userId}?access_token=${obj.id}`
            },
            (error, responsePatch, body) => {
              const obj = JSON.parse(responsePatch.body);
              expect(responsePatch.statusCode).to.equal(200);
              expect(obj.nome).to.equal("Vinícius Regatieri");
              expect(obj.realm).to.equal("Normal");
              expect(obj.username).to.equal("teste");
              expect(obj.email).to.equal("teste@teste.com");
              expect(obj.emailVerified).to.equal(false);
              done();
            }
          );
        }
      );
    });

    it("Deveria retornar status 200 e count 1 ao remover um Usuário", done => {
      request.post(
        {
          headers: {
            "content-type": "application/json"
          },
          url: `${baseUrl}/Usuarios/login`,
          body: JSON.stringify({
            username: postTest.username,
            password: postTest.password
          })
        },
        (error, response, body) => {
          const obj = JSON.parse(response.body);
          request.delete(
            {
              headers: {
                "content-type": "application/json",
                Accept: "application/json"
              },
              url: `${baseUrl}/Usuarios/${obj.userId}?access_token=${obj.id}`,
              body: JSON.stringify(updateTest)
            },
            (error, responsePatch, body) => {
              const obj = JSON.parse(responsePatch.body);
              expect(responsePatch.statusCode).to.equal(200);
              expect(obj.count).to.equal(1);
              done();
            }
          );
        }
      );
    });
  });

  describe("Testes de duplicação e integridade de dados", () => {
    it("Não é permitido deletar um Usuário sem se identificar", done => {
      request.delete(
        {
          headers: {
            "content-type": "application/json",
            Accept: "application/json"
          },
          url: `${baseUrl}/Usuarios/qualquerid`
        },
        (error, responsePatch, body) => {
          const obj = JSON.parse(responsePatch.body);
          expect(responsePatch.statusCode).to.equal(401);
          done();
        }
      );
    });

    it("Não é permitido atualizar atributos de um Usuário sem se identificar", done => {
      request.patch(
        {
          headers: {
            "content-type": "application/json",
            Accept: "application/json"
          },
          url: `${baseUrl}/Usuarios/qualquerid`,
          body: JSON.stringify(updateTest)
        },
        (error, responsePatch, body) => {
          const obj = JSON.parse(responsePatch.body);
          expect(responsePatch.statusCode).to.equal(401);
          done();
        }
      );
    });

    it("Deveria retornar 404 caso a função passada no cadastro não exista", done => {
      request.post(
        {
          headers: { "content-type": "application/json" },
          url: `${baseUrl}/Usuarios`,
          body: JSON.stringify(roleTest)
        },
        (error, response, body) => {
          const obj = JSON.parse(response.body);

          expect(response.statusCode).to.equal(404);
          expect(obj.error.message).to.equal("Realm não encontrada");
          done();
        }
      );
    });

    it("Deveria retornar status 400 e a mensagem 'Email inválido' ao tentar cadastrar um email inválido", done => {
      request.post(
        {
          headers: { "content-type": "application/json" },
          url: `${baseUrl}/Usuarios`,
          body: JSON.stringify(emailInvalidoTest)
        },
        (error, response, body) => {
          const obj = JSON.parse(response.body);

          expect(response.statusCode).to.equal(400);
          expect(obj.error.message).to.equal("Email inválido");
          done();
        }
      );
    });
  });

  describe("Testes gerais", () => {
    it("Deveria retornar status 200, chave de acesso à plataforma e id do usuário ao fazer login", done => {
      request.post(
        {
          headers: { "content-type": "application/json" },
          url: `${baseUrl}/Usuarios`,
          body: JSON.stringify(postTest)
        },
        () => {
          request.post(
            {
              headers: {
                "content-type": "application/json"
              },
              url: `${baseUrl}/Usuarios/login`,
              body: JSON.stringify({
                username: postTest.username,
                password: postTest.password
              })
            },
            (error, response, body) => {
              const obj = JSON.parse(response.body);

              expect(response.statusCode).to.equal(200);
              expect(obj.id).to.exist;
              expect(obj.userId).to.equal(postTest.id);
              done();
            }
          );
        }
      );
    });

    it('Deveria retornar status 401 e código "LOGIN_FAILED" ao tentar fazer login com credenciais inválidas ou sem se cadastrar', done => {
      request.post(
        {
          headers: { "content-type": "application/json" },
          url: `${baseUrl}/Usuarios/login`,
          body: JSON.stringify({ username: "teste", password: "111" })
        },
        (error, response, body) => {
          const obj = JSON.parse(response.body);

          expect(response.statusCode).to.equal(401);
          expect(obj.error.code).to.equal("LOGIN_FAILED");
          done();
        }
      );
    });

    it("Deveria retornar 204 ao deslogar da plataforma usando a chave de acesso", done => {
      request.post(
        {
          headers: { "content-type": "application/json" },
          url: `${baseUrl}/Usuarios/login`,
          body: JSON.stringify({
            username: postTest.username,
            password: postTest.password
          })
        },
        (error, response, body) => {
          const obj = JSON.parse(response.body);
          const token = obj.id;

          request.post(
            {
              headers: {
                "content-type": "application/json",
                Accept: "application/json",
                Authorization: token
              },
              url: `${baseUrl}/Usuarios/logout`
            },
            (error, responseLogout, bodyLogout) => {
              expect(responseLogout.statusCode).to.equal(204);
              done();
            }
          );
        }
      );
    });

    it("Deveria retornar 401 ao deslogar da plataforma sem a chave de acesso", done => {
      request.post(
        {
          headers: {
            "content-type": "application/json",
            Accept: "application/json"
          },
          url: `${baseUrl}/Usuarios/logout`
        },
        (error, responseLogout, bodyLogout) => {
          expect(responseLogout.statusCode).to.equal(401);
          done();
        }
      );
    });

    it("Deveria retornar status 204 e atualizar a senha de um Usuário", done => {
      request.post(
        {
          headers: {
            "content-type": "application/json"
          },
          url: `${baseUrl}/Usuarios/login`,
          body: JSON.stringify({
            username: postTest.username,
            password: postTest.password
          })
        },
        (error, responseLogin1, bodyLogin1) => {
          const obj = JSON.parse(responseLogin1.body);
          const token = obj.id;
          request.post(
            {
              headers: {
                "content-type": "application/json",
                Accept: "application/json",
                Authorization: token
              },
              url: `${baseUrl}/Usuarios/change-password`,
              body: JSON.stringify({
                oldPassword: postTest.password,
                newPassword: "1234"
              })
            },
            (error, response, body) => {
              expect(response.statusCode).to.equal(204);

              request.post(
                {
                  headers: {
                    "content-type": "application/json"
                  },
                  url: `${baseUrl}/Usuarios/login`,
                  body: JSON.stringify({
                    username: postTest.username,
                    password: "1234"
                  })
                },
                (error, responseLogin2, bodyLogin2) => {
                  const obj = JSON.parse(responseLogin2.body);

                  expect(responseLogin2.statusCode).to.equal(200);
                  expect(obj.id).to.exist;
                  expect(obj.userId).to.equal(postTest.id);
                  done();
                }
              );
            }
          );
        }
      );
    });

    it("Deveria retornar 204 ao tentar enviar um email logado no sistema", async () => {
      try {
        const loginDiscente = await rp.post({
          headers: {
            "content-type": "application/json",
            Accept: "application/json"
          },
          url: `${baseUrl}/Usuarios/login`,
          body: JSON.stringify({
            username: "admin",
            password: "admin"
          })
        });

        const token = JSON.parse(loginDiscente).id;
        await rp.post({
          headers: {
            "content-type": "application/json",
            Accept: "application/json",
            Authorization: token
          },
          url: `${baseUrl}/Usuarios/send-email`,
          body: JSON.stringify({
            to: "teste",
            subject: "teste",
            text: "teste"
          })
        });
      } catch (err) {
        throw err;
      }
    });

    it("Deveria retornar 401 ao tentar enviar um email sem se logar no sistema", async () => {
      try {
        await rp.post({
          headers: {
            "content-type": "application/json",
            Accept: "application/json"
          },
          url: `${baseUrl}/Usuarios/send-email`,
          body: JSON.stringify({
            to: "teste",
            subject: "teste",
            text: "teste"
          })
        });
      } catch (err) {
        expect(err.statusCode).to.equal(401);
      }
    });
  });
});
