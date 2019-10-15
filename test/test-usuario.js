'use strict';

const request = require('request');
const expect = require('chai').expect;

const baseUrl = 'http://localhost:3001/api';

const postTest = {
  nome: 'Vinícius',
  realm: 'Normal',
  username: 'vcr',
  email: 'teste@teste.com',
  password: '123',
  emailVerified: false
};

const emailInvalidoTest = {
  nome: 'Vinícius',
  realm: 'Normal',
  username: 'vcr',
  email: 'naoeumemail',
  password: '123'
};

const updateTest = {
  nome: 'Vinícius Regatieri',
  realm: 'Normal',
  username: 'vcr',
  email: 'teste@teste.com',
  password: '123',
  emailVerified: false
};

describe('Modelo Usuário', () => {
  it('Deveria criar um novo usuário e retornar status 200', done => {
    request.post(
      {
        headers: {'content-type': 'application/json'},
        url: `${baseUrl}/Usuarios`,
        body: JSON.stringify(postTest)
      },
      (error, response, body) => {
        const obj = JSON.parse(response.body);

        postTest['id'] = obj.id;
        expect(response.statusCode).to.equal(200);
        expect(obj.nome).to.equal('Vinícius');
        expect(obj.realm).to.equal('Normal');
        expect(obj.username).to.equal('vcr');
        expect(obj.email).to.equal('teste@teste.com');
        expect(obj.emailVerified).to.equal(false);
        done();
      }
    );
  });

  it("Deveria retornar status 400 e a mensagem 'Email inválido' ao tentar cadastrar um email inválido", done => {
    request.post(
      {
        headers: {'content-type': 'application/json'},
        url: `${baseUrl}/Usuarios`,
        body: JSON.stringify(emailInvalidoTest)
      },
      (error, response, body) => {
        const obj = JSON.parse(response.body);

        expect(response.statusCode).to.equal(400);
        expect(obj.error.message).to.equal('Email inválido');
        done();
      }
    );
  });

  it('Deveria retornar status 200 e atualizar atributos ao atualizar um Usuário', done => {
    request.post(
      {
        headers: {
          'content-type': 'application/json'
        },
        url: `${baseUrl}/Usuarios/login`,
        body: JSON.stringify({username: postTest.username, password: postTest.password})
      },
      (error, response, body) => {
        const obj = JSON.parse(response.body);
        request.patch(
          {
            headers: {
              'content-type': 'application/json',
              Accept: 'application/json'
            },
            url: `${baseUrl}/Usuarios/${obj.userId}?access_token=${obj.id}`,
            body: JSON.stringify(updateTest)
          },
          (error, responsePatch, body) => {
            const obj = JSON.parse(responsePatch.body);
            expect(responsePatch.statusCode).to.equal(200);
            expect(obj.nome).to.equal('Vinícius Regatieri');
            expect(obj.realm).to.equal('Normal');
            expect(obj.username).to.equal('vcr');
            expect(obj.email).to.equal('teste@teste.com');
            expect(obj.emailVerified).to.equal(false);
            done();
          }
        );
      }
    );
  });

  it('Deveria retornar status 200 o Usuário cadastrado nos testes', done => {
    request.post(
      {
        headers: {
          'content-type': 'application/json'
        },
        url: `${baseUrl}/Usuarios/login`,
        body: JSON.stringify({username: postTest.username, password: postTest.password})
      },
      (error, response, body) => {
        const obj = JSON.parse(response.body);
        request.get(
          {
            headers: {
              'content-type': 'application/json',
              Accept: 'application/json'
            },
            url: `${baseUrl}/Usuarios/${obj.userId}?access_token=${obj.id}`
          },
          (error, responsePatch, body) => {
            const obj = JSON.parse(responsePatch.body);
            expect(responsePatch.statusCode).to.equal(200);
            expect(obj.nome).to.equal('Vinícius Regatieri');
            expect(obj.realm).to.equal('Normal');
            expect(obj.username).to.equal('vcr');
            expect(obj.email).to.equal('teste@teste.com');
            expect(obj.emailVerified).to.equal(false);
            done();
          }
        );
      }
    );
  });

  it('Deveria retornar status 200 e count 1 ao remover um Usuário', done => {
    request.post(
      {
        headers: {
          'content-type': 'application/json'
        },
        url: `${baseUrl}/Usuarios/login`,
        body: JSON.stringify({username: postTest.username, password: postTest.password})
      },
      (error, response, body) => {
        const obj = JSON.parse(response.body);
        request.delete(
          {
            headers: {
              'content-type': 'application/json',
              Accept: 'application/json'
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

  it('Não é permitido deletar um Usuário sem se identificar', done => {
    request.delete(
      {
        headers: {
          'content-type': 'application/json',
          Accept: 'application/json'
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

  it('Não é permitido atualizar atributos de um Usuário sem se identificar', done => {
    request.patch(
      {
        headers: {
          'content-type': 'application/json',
          Accept: 'application/json'
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
});
