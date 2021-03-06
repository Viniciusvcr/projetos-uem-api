const request = require('request');
const expect = require('chai').expect;

const baseUrlDocente = 'http://localhost:3001/api/Docentes';
const baseUrlDiscente = 'http://localhost:3001/api/Discentes';
const baseUrlUsuario = 'http://localhost:3001/api/Usuarios';

const docente = {
  matricula: '654321',
  cargo: 'Professor',
  lotacao: 'string',
  situacao: 'string',
  vencimentoContrato: '2020-10-17T00:00:00.000Z',
  usuarioId: ''
};

const discente = {
  ra: '123456',
  curso: 'Ciência da Computação',
  turno: 'Integral',
  campus: 'Maringá',
  serie: 3,
  situacaoAcademica: 'Matriculado',
  usuarioId: ''
};

const usuarioDiscente = {
  nome: 'Vinícius',
  realm: 'Discente',
  username: 'vcr',
  email: 'vcr@projetosuem.com',
  password: '123',
  emailVerified: false
};

const usuarioDocente = {
  nome: 'Donizete',
  realm: 'Docente',
  username: 'donizete',
  email: 'donizete@projetosuem.com',
  password: '123',
  emailVerified: false
};

const usuario1 = {
  nome: 'Arnaldo',
  realm: 'Docente',
  username: 'arnaldo',
  email: 'arnaldo@projetosuem.com',
  password: '123',
  emailVerified: false
};

const usuario2 = {
  nome: 'Roberto',
  realm: 'Discente',
  username: 'roberto',
  email: 'roberto@projetosuem.com',
  password: '123',
  emailVerified: false
};

describe('Testes de Relação do Modelo Usuário', () => {
  it('Deveria retornar 200 ao cadastrar um Docente/Usuario', done => {
    request.post(
      {
        headers: {'content-type': 'application/json'},
        url: baseUrlUsuario,
        body: JSON.stringify(usuarioDocente)
      },
      (error, response, body) => {
        const obj = JSON.parse(response.body);

        docente.usuarioId = obj.id;
        request.post(
          {
            headers: {'content-type': 'application/json'},
            url: baseUrlDocente,
            body: JSON.stringify(docente)
          },
          (error, response, body) => {
            expect(response.statusCode).to.equal(200);
            done();
          }
        );
      }
    );
  });

  it('Deveria retornar 200 ao cadastrar um Discente/Usuario', done => {
    request.post(
      {
        headers: {'content-type': 'application/json'},
        url: baseUrlUsuario,
        body: JSON.stringify(usuarioDiscente)
      },
      (error, response, body) => {
        const obj = JSON.parse(response.body);

        discente.usuarioId = obj.id;
        request.post(
          {
            headers: {'content-type': 'application/json'},
            url: baseUrlDiscente,
            body: JSON.stringify(discente)
          },
          (error, response, body) => {
            expect(response.statusCode).to.equal(200);
            done();
          }
        );
      }
    );
  });
});
