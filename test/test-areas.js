/* eslint-disable object-curly-spacing */
/* eslint-disable comma-dangle */
'use strict';

const request = require('request');
const expect = require('chai').expect;

const baseUrl = 'http://localhost:3001/api/';

const postArea = {
  nome: 'Ciências exatas'
};

const patchArea = {
  nome: 'Ciências humanas'
};

describe('testes CRUD áreas', () => {
  it('deveria criar uma instancia de área e retornar 200', done => {
    request.post(
      {
        headers: {
          'content-type': 'application/json',
          Accept: 'application/json'
        },
        url: `${baseUrl}/Areas`,
        body: JSON.stringify(postArea)
      },
      (error, response, body) => {
        const obj = JSON.parse(response.body);
        postArea.id = obj.id;
        expect(response.statusCode).to.equal(200);
        expect(obj.nome).to.equal('Ciências exatas');
        done();
      }
    );
  });

  it('deveria atualizar uma instância de área e retornar 200', done => {
    request.patch(
      {
        headers: {
          'content-type': 'application/json',
          Accept: 'application/json'
        },
        url: `${baseUrl}/Areas/${postArea.id}`,
        body: JSON.stringify(patchArea)
      },
      (error, response, body) => {
        const obj = JSON.parse(response.body);
        patchArea.id = obj.id;
        expect(response.statusCode).to.equal(200);
        expect(obj.nome).to.equal('Ciências humanas');
        done();
      }
    );
  });

  it('deveria pegar uma instância de área e retornar 200', done => {
    request.get(
      {
        headers: {
          'content-type': 'application/json',
          Accept: 'application/json'
        },
        url: `${baseUrl}/Areas/${patchArea.id}`
      },
      (error, response, body) => {
        const obj = JSON.parse(response.body);
        expect(response.statusCode).to.equal(200);
        expect(obj.nome).to.equal('Ciências humanas');
        done();
      }
    );
  });

  it('deveria pegar uma instância de área e retornar 200', done => {
    request.delete(
      {
        headers: {
          'content-type': 'application/json',
          Accept: 'application/json'
        },
        url: `${baseUrl}/Areas/${postArea.id}`
      },
      (error, response, body) => {
        const obj = JSON.parse(response.body);
        expect(response.statusCode).to.equal(200);
        expect(obj.count).to.equal(1);
        done();
      }
    );
  });
});
