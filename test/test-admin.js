const request = require('request');
const expect = require('chai').expect;

const baseUrl = 'http://localhost:3001/api';

const postTest = {
  nome: 'admin1',
  realm: 'admin',
  username: 'admin1',
  email: 'admin1@projetosuem.com',
  password: 'admin'
};

describe('Modelo Usuário - Admin', () => {
  it('Deveria criar um novo Administrador e retornar status 200', done => {
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
        expect(obj.nome).to.equal(postTest.nome);
        expect(obj.realm).to.equal(postTest.realm);
        expect(obj.username).to.equal(postTest.username);
        expect(obj.email).to.equal(postTest.email);
        expect(obj.emailVerified).to.equal(postTest.emailVerified);
        done();
      }
    );
  });
});
