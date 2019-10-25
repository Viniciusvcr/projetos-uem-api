const request = require('request-promise-native');
const expect = require('chai').expect;

const baseUrlDocente = 'http://localhost:3001/api/Docentes';
const baseUrlDiscente = 'http://localhost:3001/api/Discentes';
const baseUrlUsuario = 'http://localhost:3001/api/Usuarios';

const discente = {
  email: 'vcr@projetosuem.com',
  password: '123',
  token: '',
  id: '',
  info: {}
};

const modelDiscenteUpdateInfo = {
  ra: '104016',
  curso: 'Ciência da Computação',
  turno: 'Integral',
  campus: 'Sede',
  serie: 4,
  situacaoAcademica: 'Matriculado'
};

const modelDocenteUpdateInfo = {
  matricula: '654321',
  cargo: 'Professor',
  lotacao: 'DIN',
  situacao: 'Ativo',
  vencimentoContrato: '2020-10-17T00:00:00.000Z'
};

const usuarioDiscenteUpdateInfo = {
  nome: 'Vinícius Regatieri',
  realm: 'Discente',
  username: 'vcr',
  email: 'vcr@projetosuem.com',
  emailVerified: false,
  discenteId: ''
};

const docente = {
  email: 'donizete@projetosuem.com',
  password: '123',
  token: '',
  id: '',
  info: {}
};

const login = async () => {
  try {
    const loginDiscente = await request.post({
      headers: {'content-type': 'application/json', Accept: 'application/json'},
      url: `${baseUrlUsuario}/login?include=user`,
      body: JSON.stringify({email: discente.email, password: discente.password})
    });

    const loginDocente = await request.post({
      headers: {'content-type': 'application/json', Accept: 'application/json'},
      url: `${baseUrlUsuario}/login?include=user`,
      body: JSON.stringify({email: docente.email, password: docente.password})
    });

    const loginDiscenteObj = JSON.parse(loginDiscente);
    const loginDocenteObj = JSON.parse(loginDocente);

    docente.id = loginDocenteObj.userId;
    docente.token = loginDocenteObj.id;
    docente.info = loginDocenteObj.user;
    discente.id = loginDiscenteObj.userId;
    discente.token = loginDiscenteObj.id;
    discente.info = loginDiscenteObj.user;

    const resDiscente = await request.get({
      headers: {'content-type': 'application/json', Accept: 'application/json'},
      url: `${baseUrlUsuario}/${discente.id}?filter=${JSON.stringify({include: 'discente'})}`
    });

    const resDocente = await request.get({
      headers: {'content-type': 'application/json', Accept: 'application/json'},
      url: `${baseUrlUsuario}/${docente.id}?filter=${JSON.stringify({include: 'docente'})}`
    });

    const objResDiscente = JSON.parse(resDiscente);
    const objResDocente = JSON.parse(resDocente);

    discente.discenteId = objResDiscente.discente.id;
    docente.docenteId = objResDocente.docente.id;
    return true;
  } catch (err) {
    return false;
  }
};

describe('Testes de Segurança', () => {
  describe('Testes de Segurança do Modelo Discente', () => {
    it('Deveria retornar 200 ao tentar atualizar as próprias informações', async () => {
      await login();
      try {
        const response = await request.patch({
          headers: {
            'content-type': 'application/json',
            Accept: 'application/json',
            Authorization: discente.token
          },
          url: `${baseUrlDiscente}/${discente.discenteId}`,
          body: JSON.stringify(modelDiscenteUpdateInfo)
        });

        const obj = JSON.parse(response);
        expect(obj.nome).to.equal(modelDiscenteUpdateInfo.nome);
      } catch (err) {
        throw err;
      }
    });

    it('Deveria retornar count 1 ao tentar deletar as próprias informações', async () => {
      try {
        const response = await request.delete({
          headers: {
            'content-type': 'application/json',
            Accept: 'application/json',
            Authorization: discente.token
          },
          url: `${baseUrlDiscente}/${discente.discenteId}`
        });

        const obj = JSON.parse(response);
        expect(obj.count).to.equal(1);
      } catch (err) {
        throw err;
      }
    });

    it('Deveria retornar erro ao tentar editar o cadastro de outro Discente', async () => {
      try {
        await request.patch({
          headers: {
            'content-type': 'application/json',
            Accept: 'application/json',
            Authorization: docente.token
          },
          url: `${baseUrlDiscente}/${discente.id}`,
          body: JSON.stringify(modelDiscenteUpdateInfo)
        });

        throw new Error('Deu certo');
      } catch (err) {
        const obj = JSON.parse(err.error);

        expect(obj.error.statusCode).to.equal(401);
      }
    });

    it('Deveria retornar erro ao tentar deletar um cadastro de outro Discente', async () => {
      try {
        await request.delete({
          headers: {
            'content-type': 'application/json',
            Accept: 'application/json',
            Authorization: docente.token
          },
          url: `${baseUrlDiscente}/${discente.id}`
        });

        throw new Error('Deu certo');
      } catch (err) {
        const obj = JSON.parse(err.error);

        expect(obj.error.statusCode).to.equal(401);
      }
    });

    it('Deveria retornar erro ao tentar cadastrar um novo Discente se já logado', async () => {
      try {
        await request.post({
          headers: {
            'content-type': 'application/json',
            Accept: 'application/json',
            Authorization: docente.token // Passar um token quer dizer estar logado no sistema
          },
          url: baseUrlUsuario,
          body: JSON.stringify(discente.info)
        });

        throw new Error('Deu certo');
      } catch (err) {
        const obj = JSON.parse(err.error);

        expect(obj.error.statusCode).to.equal(401);
      }
    });
  });

  describe('Testes de Segurança do Modelo Docente', () => {
    it('Deveria retornar 200 ao tentar atualizar as próprias informações', async () => {
      try {
        const response = await request.patch({
          headers: {
            'content-type': 'application/json',
            Accept: 'application/json',
            Authorization: docente.token
          },
          url: `${baseUrlDocente}/${docente.docenteId}`,
          body: JSON.stringify(modelDocenteUpdateInfo)
        });

        const obj = JSON.parse(response);
        expect(obj.lotacao).to.equal(modelDocenteUpdateInfo.lotacao);
        expect(obj.situacao).to.equal(modelDocenteUpdateInfo.situacao);
      } catch (err) {
        throw err;
      }
    });

    it('Deveria retornar count 1 ao tentar deletar as próprias informações', async () => {
      try {
        const response = await request.delete({
          headers: {
            'content-type': 'application/json',
            Accept: 'application/json',
            Authorization: docente.token
          },
          url: `${baseUrlDocente}/${docente.docenteId}`
        });

        const obj = JSON.parse(response);

        expect(obj.count).to.equal(1);
      } catch (err) {
        throw err;
      }
    });

    it('Deveria retornar erro ao tentar editar o cadastro de outro Docente', async () => {
      try {
        await request.patch({
          headers: {
            'content-type': 'application/json',
            Accept: 'application/json',
            Authorization: discente.token
          },
          url: `${baseUrlDocente}/${docente.id}`,
          body: JSON.stringify(modelDocenteUpdateInfo)
        });

        throw new Error('Deu certo');
      } catch (err) {
        const obj = JSON.parse(err.error);

        expect(obj.error.statusCode).to.equal(401);
      }
    });

    it('Deveria retornar erro ao tentar deletar um cadastro de outro Docente', async () => {
      try {
        await request.delete({
          headers: {
            'content-type': 'application/json',
            Accept: 'application/json',
            Authorization: discente.token
          },
          url: `${baseUrlDocente}/${docente.id}`
        });

        throw new Error('Deu certo');
      } catch (err) {
        const obj = JSON.parse(err.error);

        expect(obj.error.statusCode).to.equal(401);
      }
    });

    it('Deveria retornar erro ao tentar cadastrar um novo Docente se já logado', async () => {
      try {
        await request.post({
          headers: {
            'content-type': 'application/json',
            Accept: 'application/json',
            Authorization: docente.token // Passar um token quer dizer estar logado no sistema
          },
          url: baseUrlDocente,
          body: JSON.stringify(docente.info)
        });

        throw new Error('Deu certo');
      } catch (err) {
        const obj = JSON.parse(err.error);

        expect(obj.error.statusCode).to.equal(401);
      }
    });
  });

  describe('Testes de Segurança do Modelo Usuário', () => {
    it('Deveria retornar 200 ao tentar atualizar as próprias informações', async () => {
      try {
        const response = await request.patch({
          headers: {
            'content-type': 'application/json',
            Accept: 'application/json',
            Authorization: discente.token
          },
          url: `${baseUrlUsuario}/${discente.id}`,
          body: JSON.stringify(usuarioDiscenteUpdateInfo)
        });

        const obj = JSON.parse(response);
        expect(obj.nome).to.equal(usuarioDiscenteUpdateInfo.nome);
      } catch (err) {
        throw err;
      }
    });

    it('Deveria retornar count 1 ao tentar deletar as próprias informações', async () => {
      try {
        const response = await request.delete({
          headers: {
            'content-type': 'application/json',
            Accept: 'application/json',
            Authorization: discente.token
          },
          url: `${baseUrlUsuario}/${discente.id}`
        });

        const obj = JSON.parse(response);

        expect(obj.count).to.equal(1);
      } catch (err) {
        throw err;
      }
    });

    it('Deveria retornar erro ao tentar editar o cadastro de outro usuário', async () => {
      try {
        await request.patch({
          headers: {
            'content-type': 'application/json',
            Accept: 'application/json',
            Authorization: docente.token
          },
          url: `${baseUrlUsuario}/${discente.id}`,
          body: JSON.stringify(usuarioDiscenteUpdateInfo)
        });

        throw new Error('Deu certo');
      } catch (err) {
        const obj = JSON.parse(err.error);

        expect(obj.error.statusCode).to.equal(401);
      }
    });

    it('Deveria retornar erro ao tentar deletar um cadastro de outro Usuário', async () => {
      try {
        await request.delete({
          headers: {
            'content-type': 'application/json',
            Accept: 'application/json',
            Authorization: docente.token
          },
          url: `${baseUrlUsuario}/${discente.id}`
        });

        throw new Error('Deu certo');
      } catch (err) {
        const obj = JSON.parse(err.error);

        expect(obj.error.statusCode).to.equal(401);
      }
    });

    it('Deveria retornar erro ao tentar cadastrar um novo Usuário se já logado', async () => {
      try {
        await request.post({
          headers: {
            'content-type': 'application/json',
            Accept: 'application/json',
            Authorization: docente.token // Passar um token quer dizer estar logado no sistema
          },
          url: baseUrlUsuario,
          body: JSON.stringify(docente.info)
        });
      } catch (err) {
        const obj = JSON.parse(err.error);

        expect(obj.error.statusCode).to.equal(401);
      }
    });
  });
});
