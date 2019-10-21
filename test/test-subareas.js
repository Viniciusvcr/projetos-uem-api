/* eslint-disable object-curly-spacing */
/* eslint-disable comma-dangle */
'use strict';

const request = require('request');
const expect = require('chai').expect;

const baseUrl = 'http://localhost:3001/api/';

const postSubarea = {
  nome: 'Ciência da computação'
};

const patchSubarea = {
  nome: 'Qualquer curso mais fácil, pelo amor de deus alguém me ajuda'
};

describe('testes CRUD áreas', () => {
  it('deveria criar uma instancia de área e retornar 200', done => {
    request.post(
      {
        headers: {
          'content-type': 'application/json',
          Accept: 'application/json'
        },
        url: `${baseUrl}/Subareas`,
        body: JSON.stringify(postSubarea)
      },
      (error, response, body) => {
        const obj = JSON.parse(response.body);
        postSubarea.id = obj.id;
        expect(response.statusCode).to.equal(200);
        expect(obj.nome).to.equal('Ciência da computação');
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
        url: `${baseUrl}/Subareas/${postSubarea.id}`,
        body: JSON.stringify(patchSubarea)
      },
      (error, response, body) => {
        const obj = JSON.parse(response.body);
        patchSubarea.id = obj.id;
        expect(response.statusCode).to.equal(200);
        expect(obj.nome).to.equal(
          'Qualquer curso mais fácil, pelo amor de deus alguém me ajuda'
        );
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
        url: `${baseUrl}/Subareas/${patchSubarea.id}`
      },
      (error, response, body) => {
        const obj = JSON.parse(response.body);
        expect(response.statusCode).to.equal(200);
        expect(obj.nome).to.equal(
          'Qualquer curso mais fácil, pelo amor de deus alguém me ajuda'
        );
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
        url: `${baseUrl}/Subareas/${postSubarea.id}`
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
