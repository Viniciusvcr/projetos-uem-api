'use strict';

const request = require('request');
const expect = require('chai').expect;
const baseUrl = 'http://localhost:3001/api/';
const postPesquisa = {
  titulo: 'string',
  dataInicio: '2019-10-28T17:06:06.625Z',
  dataTermino: '2019-10-28T17:06:06.625Z',
  limiteParticipantes: 0,
  atualParticipantes: 0,
  ativo: true,
  resumo: 'string',
  requisitos: 'string',
  tipo: 'string',
  docenteId: '123',
  areaId: 1,
  subareaId: 1
};

describe('testes CRUD pesquisa', () => {
  it('deveria criar uma pesquisa e retornar 200', done => {
    request.post(
      {
        headers: {
          'content-type': 'application/json',
          Accept: 'application/json'
        },
        url: `${baseUrl}/Projetos`,
        body: JSON.stringify(postPesquisa)
      },
      (error, response, body) => {
        const obj = JSON.parse(response.body);
        postPesquisa.id = obj.id;
        expect(response.statusCode).to.equal(200);
        done();
      }
    );
  });
});
