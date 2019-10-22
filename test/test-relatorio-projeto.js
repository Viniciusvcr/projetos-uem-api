'use strict';

const request = require('request');
const expect = require('chai').expect;
const chai = require('chai');
chai.use(require('chai-datetime'));

const baseUrl = 'http://localhost:3001/api';

const projetoPost = {
  titulo: 'Pesquisa de software',
  dataInicio: new Date(2019, 10, 1, 0, 0, 0, 0),
  dataTermino: new Date(2020, 9, 30, 0, 0, 0, 0),
  limiteParticipantes: 3,
  resumo: 'Pesquisa sobre Engenharia de Software',
  tipo: 'PIC',
};

const relatorioPostError = {
  projetoId: 30,
};

describe('Testes Relatório Projetos', () => {
  it('Deveria criar um projeto e retornar status code 200', done => {
    request.post(
      {
        headers: {'content-type': 'application/json'},
        url: `${baseUrl}/Projetos`,
        body: JSON.stringify(projetoPost),
      },
      (error, response, body) => {
        const obj = JSON.parse(response.body);

        projetoPost['id'] = obj.id;
        expect(response.statusCode).to.equal(200);
        expect(obj.titulo).to.equal('Pesquisa de software');
        expect(new Date(obj.dataInicio)).to.equalDate(
          projetoPost['dataInicio']
        );
        expect(new Date(obj.dataTermino)).to.equalDate(
          projetoPost['dataTermino']
        );
        expect(obj.atualParticipantes).to.equal(0);
        expect(obj.limiteParticipantes).to.equal(3);
        expect(obj.resumo).to.equal('Pesquisa sobre Engenharia de Software');
        expect(obj.ativo).to.equal(true);
        expect(obj.tipo).to.equal('PIC');
        done();
      }
    );
  });
  // eslint-disable-next-line max-len
  it('Deveria tentar criar um relatório e retornar status code 400 - Falha ao duplicar o relatório de um projeto', done => {
    request.post(
      {
        headers: {'content-type': 'application/json'},
        // eslint-disable-next-line max-len
        url: `${baseUrl}/relatorioProjetos`,
        body: JSON.stringify({
          dataCriacao: new Date(2020, 9, 30, 0, 0, 0, 0),
          projetoId: projetoPost.id,
        }),
      },
      (error, response, body) => {
        const obj = JSON.parse(response.body);

        expect(response.statusCode).to.equal(409);
        expect(obj.error.message).to.equal(
          'Relatório para o projeto já existente.'
        );
        done();
      }
    );
  });

  it('Deveria buscar um Relatório e retornar status code 200', done => {
    request.get(
      {
        headers: {'content-type': 'application/json'},
        // eslint-disable-next-line max-len
        url: `${baseUrl}/relatorioProjetos?filter={"where":{"projetoId":"${projetoPost.id}"}}`,
      },
      (error, response, body) => {
        const obj = JSON.parse(response.body);

        expect(response.statusCode).to.equal(200);
        expect(obj[0].projetoId).to.equal(projetoPost.id);
        expect(obj[0].numeroAcessos).to.equal(0);
        done();
      }
    );
  });
  // eslint-disable-next-line max-len
  it('Deveria tentar dar update em um Relatório e retornar status code 404 - Projeto não existe', done => {
    request.patch(
      {
        headers: {'content-type': 'application/json'},
        url: `${baseUrl}/relatorioProjetos/1`,
        body: JSON.stringify(relatorioPostError),
      },
      (error, response, body) => {
        const obj = JSON.parse(response.body);

        expect(response.statusCode).to.equal(404);
        expect(obj.error.message).to.equal('Projeto não encontrado.');
        done();
      }
    );
  });
  // eslint-disable-next-line max-len
  it('Deveria retornar a média de acessos de um projeto e status code 200', done => {
    request.get(
      {
        headers: {'content-type': 'application/json'},
        url: `${baseUrl}/Projetos/2`,
      },
      (error, response, body) => {
        const obj = JSON.parse(response.body);

        expect(response.statusCode).to.equal(200);
        request.get(
          {
            headers: {'content-type': 'application/json'},
            url: `${baseUrl}/Projetos/2`,
          },
          (error, response, body) => {
            const obj = JSON.parse(response.body);

            expect(response.statusCode).to.equal(200);
            request.get(
              {
                headers: {'content-type': 'application/json'},
                url: `${baseUrl}/Projetos/2`,
              },
              (error, response, body) => {
                const obj = JSON.parse(response.body);

                expect(response.statusCode).to.equal(200);
                request.get(
                  {
                    headers: {'content-type': 'application/json'},
                    // eslint-disable-next-line max-len
                    url: `${baseUrl}/relatorioProjetos/mediaAcessos?projetoId=2`,
                  },
                  (error, response, body) => {
                    const obj = JSON.parse(response.body);

                    expect(response.statusCode).to.equal(200);
                    expect(obj).to.equal(3);
                    done();
                  }
                );
              }
            );
          }
        );
      }
    );
  });
});
