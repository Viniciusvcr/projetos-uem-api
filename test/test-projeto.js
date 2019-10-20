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

const projetoDateError = {
  titulo: 'Pesquisa de PAA',
  dataInicio: new Date(2020, 10, 1, 0, 0, 0, 0),
  dataTermino: new Date(2019, 9, 30, 0, 0, 0, 0),
  limiteParticipantes: 3,
  resumo: 'Pesquisa sobre Projeto e Análise de Algoritmos',
  tipo: 'PIBIC',
};

const projetoLimiteError = {
  titulo: 'Pesquisa de LFA',
  dataInicio: new Date(2018, 10, 1, 0, 0, 0, 0),
  dataTermino: new Date(2019, 9, 30, 0, 0, 0, 0),
  limiteParticipantes: 2,
  atualParticipantes: 3,
  resumo: 'Pesquisa sobre Linguages Formais e Autômatos',
  tipo: 'PIC',
};

const projetoUpdate = {
  titulo: 'Pesquisa de Engenharia de Software',
  dataInicio: new Date(2018, 10, 1, 0, 0, 0, 0),
  dataTermino: new Date(2019, 9, 30, 0, 0, 0, 0),
  limiteParticipantes: 2,
  atualParticipantes: 2,
  resumo: 'Pesquisa sobre Métodos Ágeis',
  tipo: 'PIC',
};

const projetoUpdateDateError = {
  dataInicio: new Date(2019, 10, 1, 0, 0, 0, 0),
  dataTermino: new Date(2018, 9, 30, 0, 0, 0, 0),
};

const projetoUpdateLimiteError = {
  atualParticipantes: 5,
  limiteParticipantes: 2,
};

describe('Testes Projetos', () => {
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
  it('Deveria criar um projeto e retornar status code 400 - Falha ao colocar uma data de início maior que a data de término', done => {
    request.post(
      {
        headers: {'content-type': 'application/json'},
        url: `${baseUrl}/Projetos`,
        body: JSON.stringify(projetoDateError),
      },
      (error, response, body) => {
        const obj = JSON.parse(response.body);

        expect(response.statusCode).to.equal(400);
        expect(obj.error.message).to.equal(
          'Data de término antecede data de início.'
        );
        done();
      }
    );
  });
  // eslint-disable-next-line max-len
  it('Deveria criar um projeto e retornar status code 400 - Falha ao colocar uma quantidade atual de participantes maior que o limite', done => {
    request.post(
      {
        headers: {'content-type': 'application/json'},
        url: `${baseUrl}/Projetos`,
        body: JSON.stringify(projetoLimiteError),
      },
      (error, response, body) => {
        const obj = JSON.parse(response.body);

        expect(response.statusCode).to.equal(400);
        expect(obj.error.message).to.equal(
          'Quantidade atual de participantes excede o limite permitido.'
        );
        done();
      }
    );
  });
  // eslint-disable-next-line max-len
  it('Deveria atualizar os atributos do projeto e retornar status code 200', done => {
    request.patch(
      {
        headers: {
          'content-type': 'application/json',
          Accept: 'application/json',
        },
        url: `${baseUrl}/Projetos/${projetoPost.id}`,
        body: JSON.stringify(projetoUpdate),
      },
      (error, response, body) => {
        const obj = JSON.parse(response.body);

        expect(response.statusCode).to.equal(200);
        expect(obj.titulo).to.equal('Pesquisa de Engenharia de Software');
        expect(new Date(obj.dataInicio)).to.equalDate(
          projetoUpdate['dataInicio']
        );
        expect(new Date(obj.dataTermino)).to.equalDate(
          projetoUpdate['dataTermino']
        );
        expect(obj.atualParticipantes).to.equal(2);
        expect(obj.limiteParticipantes).to.equal(2);
        expect(obj.resumo).to.equal('Pesquisa sobre Métodos Ágeis');
        expect(obj.ativo).to.equal(true);
        expect(obj.tipo).to.equal('PIC');
        done();
      }
    );
  });
  // eslint-disable-next-line max-len
  it('Deveria atualizar os atributos do projeto e retornar status code 400 - Falha ultrapassar o limite máximo de inscritos', done => {
    request.patch(
      {
        headers: {
          'content-type': 'application/json',
          Accept: 'application/json',
        },
        url: `${baseUrl}/Projetos/${projetoPost.id}`,
        body: JSON.stringify(projetoUpdateLimiteError),
      },
      (error, response, body) => {
        const obj = JSON.parse(response.body);

        expect(response.statusCode).to.equal(400);
        expect(obj.error.message).to.equal(
          'Quantidade atual de participantes excede o limite permitido.'
        );
        done();
      }
    );
  });
  // eslint-disable-next-line max-len
  it('Deveria atualizar os atributos do projeto e retornar status code 400 - Falha ultrapassar ao colocar data de término menor que data de início', done => {
    request.patch(
      {
        headers: {
          'content-type': 'application/json',
          Accept: 'application/json',
        },
        url: `${baseUrl}/Projetos/${projetoPost.id}`,
        body: JSON.stringify(projetoUpdateDateError),
      },
      (error, response, body) => {
        const obj = JSON.parse(response.body);

        expect(response.statusCode).to.equal(400);
        expect(obj.error.message).to.equal(
          'Data de término antecede data de início.'
        );
        done();
      }
    );
  });

  it('Deveria buscar um projeto e retornar status code 200', done => {
    request.get(
      {
        headers: {'content-type': 'application/json'},
        url: `${baseUrl}/Projetos/${projetoPost.id}`,
      },
      (error, response, body) => {
        const obj = JSON.parse(response.body);

        expect(response.statusCode).to.equal(200);
        expect(obj.titulo).to.equal('Pesquisa de Engenharia de Software');
        expect(new Date(obj.dataInicio)).to.equalDate(
          projetoUpdate['dataInicio']
        );
        expect(new Date(obj.dataTermino)).to.equalDate(
          projetoUpdate['dataTermino']
        );
        expect(obj.atualParticipantes).to.equal(2);
        expect(obj.limiteParticipantes).to.equal(2);
        expect(obj.resumo).to.equal('Pesquisa sobre Métodos Ágeis');
        expect(obj.ativo).to.equal(true);
        expect(obj.tipo).to.equal('PIC');
        done();
      }
    );
  });
});
