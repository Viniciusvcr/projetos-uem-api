/* eslint-disable object-curly-spacing */
/* eslint-disable comma-dangle */
'use strict';

const request = require('request');
const expect = require('chai').expect;

const baseUrl = 'http://localhost:3001/api/';

const postAcessoMensaUsuario = {
  quantidadeAcessos: 1
};

const patchAcessoMensaUsuario = {
  quantidadeAcessos: 999
};

describe('testes CRUD áreas', () => {
  it('deveria criar uma instancia de área e retornar 200', done => {
    request.post(
      {
        headers: {
          'content-type': 'application/json',
          Accept: 'application/json'
        },
        url: `${baseUrl}/AcessosMensaisUsuarios`,
        body: JSON.stringify(postAcessoMensaUsuario)
      },
      (error, response, body) => {
        const obj = JSON.parse(response.body);
        postAcessoMensaUsuario.id = obj.id;
        expect(response.statusCode).to.equal(200);
        expect(obj.quantidadeAcessos).to.equal(1);
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
        url: `${baseUrl}/AcessosMensaisUsuarios/${postAcessoMensaUsuario.id}`,
        body: JSON.stringify(patchAcessoMensaUsuario)
      },
      (error, response, body) => {
        const obj = JSON.parse(response.body);
        patchAcessoMensaUsuario.id = obj.id;
        expect(response.statusCode).to.equal(200);
        expect(obj.quantidadeAcessos).to.equal(999);
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
        url: `${baseUrl}/AcessosMensaisUsuarios/${patchAcessoMensaUsuario.id}`
      },
      (error, response, body) => {
        const obj = JSON.parse(response.body);
        expect(response.statusCode).to.equal(200);
        expect(obj.quantidadeAcessos).to.equal(999);
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
        url: `${baseUrl}/AcessosMensaisUsuarios/${postAcessoMensaUsuario.id}`
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
