'use strict';

const request = require('request');
const expect = require('chai').expect;

const baseUrl = 'http://localhost:3001/api';

const postTest = {
  prerequisitos: 'saber codar em javascript',
  descricao: 'nesse projeto vc vai aprender javascript',
  dataInicio: '2019-10-19T17:04:53.015Z',
  encerrado: false,
};

const invalidDateTest = {
  prerequisitos: 'saber codar em javascript',
  descricao: 'nesse projeto vc vai aprender javascript',
  dataInicio: '2017-10-19T17:04:53.015Z',
  encerrado: false,
};

const updateTest = {
  prerequisitos: 'agora nao precisa saber codar em javascript',
  descricao: 'nesse projeto vc vai aprender python',
  dataInicio: '2019-11-19T17:04:53.015Z',
  encerrado: false,
};

describe('Modelo Processo Seletivo', () => {
  describe('Testes CRUD', () => {
    it('Deveria criar um novo processo seletivo e retornar status 200', done => {
      request.post(
        {
          headers: {'content-type': 'application/json'},
          url: `${baseUrl}/processosSeletivos`,
          body: JSON.stringify(postTest),
        },
        (error, response, body) => {
          const obj = JSON.parse(response.body);

          postTest['id'] = obj.id;
          expect(response.statusCode).to.equal(200);
          expect(obj.prerequisitos).to.equal(postTest['prerequisitos']);
          expect(obj.descricao).to.equal(postTest['descricao']);
          expect(obj.dataInicio).to.equal(postTest['dataInicio']);
          expect(obj.encerrado).to.equal(postTest['encerrado']);
          done();
        }
      );
    });

    it('Deveria retornar status 200 e atualizar atributos ao atualizar um processo seletivo', done => {
      request.patch(
        {
          headers: {
            'content-type': 'application/json',
            Accept: 'application/json',
          },
          url: `${baseUrl}/processosSeletivos/${postTest['id']}`,
          body: JSON.stringify(updateTest),
        },
        (error, responsePatch, body) => {
          const obj = JSON.parse(responsePatch.body);
          expect(responsePatch.statusCode).to.equal(200);
          expect(obj.prerequisitos).to.equal(updateTest['prerequisitos']);
          expect(obj.descricao).to.equal(updateTest['descricao']);
          expect(obj.dataInicio).to.equal(updateTest['dataInicio']);
          expect(obj.encerrado).to.equal(updateTest['encerrado']);
          done();
        }
      );
    });

    it('Deveria retornar status 200 o processo seletivo atualizado nos testes', done => {
      request.get(
        {
          headers: {
            'content-type': 'application/json',
            Accept: 'application/json',
          },
          url: `${baseUrl}/processosSeletivos/${postTest['id']}`,
        },
        (error, responsePatch, body) => {
          const obj = JSON.parse(responsePatch.body);
          expect(responsePatch.statusCode).to.equal(200);
          expect(obj.prerequisitos).to.equal(updateTest['prerequisitos']);
          expect(obj.descricao).to.equal(updateTest['descricao']);
          expect(obj.dataInicio).to.equal(updateTest['dataInicio']);
          expect(obj.encerrado).to.equal(updateTest['encerrado']);
          done();
        }
      );
    });

    it('Deveria retornar status 200 e count 1 ao remover um processo seletivo', done => {
      request.delete(
        {
          headers: {
            'content-type': 'application/json',
            Accept: 'application/json',
          },
          url: `${baseUrl}/processosSeletivos/${postTest['id']}`,
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

  describe('Teste de integridade de dados', () => {
    it('Não é permitido criar um processo seletivo com uma data anterior à atual', done => {
      request.post(
        {
          headers: {
            'content-type': 'application/json',
            Accept: 'application/json',
          },
          url: `${baseUrl}/processosSeletivos`,
          body: JSON.stringify(invalidDateTest),
        },
        (error, responsePatch, body) => {
          const obj = JSON.parse(responsePatch.body);
          expect(responsePatch.statusCode).to.equal(400);
          done();
        }
      );
    });
  });
});
