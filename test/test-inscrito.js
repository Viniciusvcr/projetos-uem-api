'use strict';

const request = require('request');
const expect = require('chai').expect;

const baseUrl = 'http://localhost:3001/api';

const postTest = {
  aprovado: true,
};

const updateTest = {
  aprovado: false,
};

describe('Modelo Processo Seletivo', () => {
  describe('Testes CRUD', () => {
    it('Deveria criar um novo inscrito e retornar status 200', done => {
      request.post(
        {
          headers: {'content-type': 'application/json'},
          url: `${baseUrl}/Inscritos`,
          body: JSON.stringify(postTest),
        },
        (error, response, body) => {
          const obj = JSON.parse(response.body);

          postTest['id'] = obj.id;
          expect(response.statusCode).to.equal(200);
          expect(obj.aprovado).to.equal(postTest['aprovado']);
          done();
        }
      );
    });

    it('Deveria retornar status 200 e atualizar atributos ao atualizar um inscrito', done => {
      request.patch(
        {
          headers: {
            'content-type': 'application/json',
            Accept: 'application/json',
          },
          url: `${baseUrl}/Inscritos/${postTest['id']}`,
          body: JSON.stringify(updateTest),
        },
        (error, responsePatch, body) => {
          const obj = JSON.parse(responsePatch.body);
          expect(responsePatch.statusCode).to.equal(200);
          expect(obj.aprovado).to.equal(updateTest['aprovado']);
          done();
        }
      );
    });

    it('Deveria retornar status 200 o inscrito atualizado nos testes', done => {
      request.get(
        {
          headers: {
            'content-type': 'application/json',
            Accept: 'application/json',
          },
          url: `${baseUrl}/Inscritos/${postTest['id']}`,
        },
        (error, responsePatch, body) => {
          const obj = JSON.parse(responsePatch.body);
          expect(responsePatch.statusCode).to.equal(200);
          expect(obj.aprovado).to.equal(updateTest['aprovado']);
          done();
        }
      );
    });

    it('Deveria retornar status 200 e count 1 ao remover um inscrito', done => {
      request.delete(
        {
          headers: {
            'content-type': 'application/json',
            Accept: 'application/json',
          },
          url: `${baseUrl}/Inscritos/${postTest['id']}`,
          body: JSON.stringify(updateTest),
        },
        (error, responsePatch, body) => {
          const obj = JSON.parse(responsePatch.body);
          expect(responsePatch.statusCode).to.equal(200);
          expect(obj.count).to.equal(1);
          done();
        }
      );
    });
  });
});
