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
});
