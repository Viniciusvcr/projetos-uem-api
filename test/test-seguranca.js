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

    discente.id = loginDiscenteObj.userId;
    discente.token = loginDiscenteObj.id;
    discente.info = loginDiscenteObj.user;
    usuarioDiscenteUpdateInfo.discenteId = discente.info.discenteId;

    docente.id = loginDocenteObj.userId;
    docente.token = loginDocenteObj.id;
    docente.info = loginDocenteObj.user;
  } catch (err) {
    console.error(err);
  }

  return true;
};

describe('Testes de Segurança do Modelo Usuário', () => {
  it('Deveria retornar 200 ao tentar atualizar as próprias informações', async () => {
    await login();

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
});
