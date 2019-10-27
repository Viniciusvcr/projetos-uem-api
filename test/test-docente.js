const request = require('request');
const expect = require('chai').expect;

const baseUrl = 'http://localhost:3001/api';

const postTest = {
  matricula: '123456',
  cargo: 'Professor',
  lotacao: 'string',
  situacao: 'string',
  vencimentoContrato: '2020-10-17T00:00:00.000Z'
};

const updateTest = {
  matricula: '654321',
  cargo: 'Professor Titular',
  lotacao: 'string',
  situacao: 'string',
  vencimentoContrato: '2020-10-17T00:00:00.000Z'
};

const matriculaDuplicadaTest = {
  matricula: '111111',
  cargo: 'Chefe do departamento',
  lotacao: 'string',
  situacao: 'string',
  vencimentoContrato: '2020-10-17T00:00:00.000Z'
};

const contratoVencidoTest = {
  matricula: '789456',
  cargo: 'Professor aposentado',
  lotacao: 'string',
  situacao: 'string',
  vencimentoContrato: '2018-10-17T00:00:00.000Z'
};

describe('Modelo Docente', () => {
  describe('Testes CRUD', () => {
    it('Deveria criar um novo Docente e retornar status 200', done => {
      request.post(
        {
          headers: {'content-type': 'application/json'},
          url: `${baseUrl}/Docentes`,
          body: JSON.stringify(postTest)
        },
        (error, response, body) => {
          const obj = JSON.parse(response.body);

          postTest['id'] = obj.id;
          expect(response.statusCode).to.equal(200);
          expect(obj.matricula).to.equal(postTest.matricula);
          expect(obj.cargo).to.equal(postTest.cargo);
          expect(obj.lotacao).to.equal(postTest.lotacao);
          expect(obj.situacao).to.equal(postTest.situacao);
          expect(obj.vencimentoContrato).to.equal(postTest.vencimentoContrato);
          done();
        }
      );
    });

    it('Deveria retornar status 200 e o Docente cadastrado nos testes', done => {
      request.get(
        {
          headers: {
            'content-type': 'application/json',
            Accept: 'application/json'
          },
          url: `${baseUrl}/Docentes/${postTest.id}`
        },
        (error, response, body) => {
          const obj = JSON.parse(response.body);

          expect(response.statusCode).to.equal(200);
          expect(obj.matricula).to.equal(postTest.matricula);
          expect(obj.cargo).to.equal(postTest.cargo);
          expect(obj.lotacao).to.equal(postTest.lotacao);
          expect(obj.situacao).to.equal(postTest.situacao);
          expect(obj.vencimentoContrato).to.equal(postTest.vencimentoContrato);
          done();
        }
      );
    });

    it('Deveria retornar status 401 ao tentar atualizar atributos de um Docente sem se identificar', done => {
      request.patch(
        {
          headers: {
            'content-type': 'application/json',
            Accept: 'application/json'
          },
          url: `${baseUrl}/Docentes/${postTest.id}`,
          body: JSON.stringify(updateTest)
        },
        (error, response, body) => {
          const obj = JSON.parse(response.body);

          expect(response.statusCode).to.equal(401);
          done();
        }
      );
    });

    it('Deveria retornar status 401 ao tentar remover um Docente sem se identificar', done => {
      request.delete(
        {
          headers: {
            'content-type': 'application/json',
            Accept: 'application/json'
          },
          url: `${baseUrl}/Docentes/${postTest.id}`
        },
        (error, response, body) => {
          const obj = JSON.parse(response.body);

          expect(response.statusCode).to.equal(401);
          done();
        }
      );
    });
  });

  describe('Testes de duplicação e integridade de dados', () => {
    it('Deveria retornar status 400 e a mensagem "Matrícula já cadastrada" ao tentar cadastrar uma matrícula já existente', done => {
      request.post(
        {
          headers: {'content-type': 'application/json'},
          url: `${baseUrl}/Docentes`,
          body: JSON.stringify(matriculaDuplicadaTest)
        },
        () => {
          request.post(
            {
              headers: {'content-type': 'application/json'},
              url: `${baseUrl}/Docentes`,
              body: JSON.stringify(matriculaDuplicadaTest)
            },
            (error, response, body) => {
              body = JSON.parse(body);

              expect(response.statusCode).to.equal(400);
              expect(body.error.message).to.equal('Matrícula já cadastrada');
              done();
            }
          );
        }
      );
    });

    it('Deveria retornar status 400 e a mensagem "Contrato vencido com a instituição" ao tentar cadastrar um Docente com contrato menor que a data atual', done => {
      request.post(
        {
          headers: {'content-type': 'application/json'},
          url: `${baseUrl}/Docentes`,
          body: JSON.stringify(contratoVencidoTest)
        },
        (error, response, body) => {
          body = JSON.parse(body);

          expect(response.statusCode).to.equal(400);
          expect(body.error.message).to.equal('Contrato vencido com a instituição');
          done();
        }
      );
    });
  });
});
