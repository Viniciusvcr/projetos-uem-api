'use strict';

const request = require('request');
const expect = require('chai').expect;

const baseUrl = 'http://localhost:3001/api';

const postTest = {
  aprovado: true
};

const updateTest = {
  aprovado: false
};
const postProcessoSeletivo = {
  prerequisitos: 'saber codar em javascript',
  descricao: 'nesse projeto vc vai aprender javascript',
  dataInicio: '2019-11-20T17:04:53.015Z',
  encerrado: false
};
const postProcessoSeletivoEncerrado = {
  prerequisitos: 'saber codar em javascript',
  descricao: 'nesse projeto vc vai aprender javascript',
  dataInicio: '2019-11-20T17:04:53.015Z',
  encerrado: true
};
const postDiscente = {
  ra: '105422',
  curso: 'Ciência da Computação',
  turno: 'Integral',
  campus: 'Maringá',
  serie: 3,
  situacaoAcademica: 'Matriculado'
};

describe('Modelo Inscrito', () => {
  describe('Testes CRUD', () => {
    it('Deveria criar um novo inscrito e retornar status 200', done => {
      request.post(
        {
          headers: {'content-type': 'application/json'},
          url: `${baseUrl}/Inscritos`,
          body: JSON.stringify(postTest)
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
            Accept: 'application/json'
          },
          url: `${baseUrl}/Inscritos/${postTest['id']}`,
          body: JSON.stringify(updateTest)
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
            Accept: 'application/json'
          },
          url: `${baseUrl}/Inscritos/${postTest['id']}`
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
            Accept: 'application/json'
          },
          url: `${baseUrl}/Inscritos/${postTest['id']}`,
          body: JSON.stringify(updateTest)
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
  describe('Teste de vinculação com discente', () => {
    it('Deveria retornar status 200 o inscrito com a chave estrangeira igual ao id do discente criado', done => {
      request.post(
        {
          headers: {
            'content-type': 'application/json',
            Accept: 'application/json'
          },
          url: `${baseUrl}/Discentes`,
          body: JSON.stringify(postDiscente)
        },
        (error, responsePatch, body) => {
          const objDiscente = JSON.parse(responsePatch.body);
          const discenteId = objDiscente.id;
          updateTest.discenteId = discenteId;
          console.log(objDiscente);
          request.post(
            {
              headers: {
                'content-type': 'application/json',
                Accept: 'application/json'
              },
              url: `${baseUrl}/Inscritos`,
              body: JSON.stringify(updateTest)
            },
            (error, responsePatch, body) => {
              const obj = JSON.parse(responsePatch.body);
              expect(responsePatch.statusCode).to.equal(200);
              expect(obj.discenteId).to.equal(discenteId);
              done();
            }
          );
        }
      );
    });
  });
  describe('Teste de vinculação com processo seletivo', () => {
    it('Deveria retornar status 200 o inscrito com a chave estrangeira igual ao id do processo seletivo criado', done => {
      request.post(
        {
          headers: {
            'content-type': 'application/json',
            Accept: 'application/json'
          },
          url: `${baseUrl}/processosSeletivos`,
          body: JSON.stringify(postProcessoSeletivo)
        },
        (error, responsePatch, body) => {
          const objProcessoSeletivo = JSON.parse(responsePatch.body);
          const idProcessoSeletivo = objProcessoSeletivo.id;
          updateTest.processoSeletivoId = idProcessoSeletivo;
          request.post(
            {
              headers: {
                'content-type': 'application/json',
                Accept: 'application/json'
              },
              url: `${baseUrl}/Inscritos`,
              body: JSON.stringify(updateTest)
            },
            (error, responsePatch, body) => {
              const obj = JSON.parse(responsePatch.body);
              expect(responsePatch.statusCode).to.equal(200);
              expect(obj.processoSeletivoId).to.equal(objProcessoSeletivo.id);
              done();
            }
          );
        }
      );
    });
    it('Deveria retornar status 409 porque não se pode ter duplicatas', done => {
      request.post(
        {
          headers: {
            'content-type': 'application/json',
            Accept: 'application/json'
          },
          url: `${baseUrl}/Inscritos`,
          body: JSON.stringify(updateTest)
        },
        (error, responsePatch, body) => {
          const obj = JSON.parse(responsePatch.body);
          expect(responsePatch.statusCode).to.equal(409);
          done();
        }
      );
    });
    it('Deveria retornar status 409 porque não se pode se inscrever em um processo encerrado', done => {
      request.post(
        {
          headers: {
            'content-type': 'application/json',
            Accept: 'application/json'
          },
          url: `${baseUrl}/processosSeletivos`,
          body: JSON.stringify(postProcessoSeletivoEncerrado)
        },
        (error, responsePatch, body) => {
          const objProcessoSeletivo = JSON.parse(responsePatch.body);
          const idProcessoSeletivo = objProcessoSeletivo.id;
          updateTest.processoSeletivoId = idProcessoSeletivo;
          request.post(
            {
              headers: {
                'content-type': 'application/json',
                Accept: 'application/json'
              },
              url: `${baseUrl}/Inscritos`,
              body: JSON.stringify(updateTest)
            },
            (error, responsePatch, body) => {
              expect(responsePatch.statusCode).to.equal(409);
              done();
            }
          );
        }
      );
    });
  });
});
