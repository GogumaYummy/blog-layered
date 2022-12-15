const supertest = require('supertest');
const app = require('../../src/app');
const { sequelize } = require('../../src/models');

beforeAll(async () => {
  if (process.env.NODE_ENV === 'test') await sequelize.sync();
  else throw new Error('테스트 환경이 아닙니다!');
});

describe('Auth 도메인 통합 테스트', () => {
  describe('POST /auth/register API 테스트', () => {
    test('성공 케이스', async () => {
      const response = await supertest(app).post('/auth/register').send({
        email: 'goguma@yummy.com',
        nickname: 'GogumaYum',
        password: 'P4$$W0RD',
        confirm: 'P4$$W0RD',
      });

      expect(response.status).toBe(200);

      expect(response.body).toEqual({ message: '회원 가입에 성공했습니다.' });
    });

    test('실패 케이스 - body가 존재하지 않음', async () => {
      const response = await supertest(app).post('/auth/register').send({});

      expect(response.status).toBe(400);

      expect(response.body).toEqual({ errorMessage: '잘못된 요청입니다.' });
    });

    test('실패 케이스 - 이미 가입된 이메일', async () => {
      const response = await supertest(app).post('/auth/register').send({
        email: 'goguma@yummy.com',
        nickname: 'GogumaYum',
        password: 'P4$$W0RD',
        confirm: 'P4$$W0RD',
      });

      expect(response.status).toBe(400);

      expect(response.body).toEqual({
        errorMessage: '이미 가입된 이메일입니다.',
      });
    });
  });

  describe('POST /auth/login API 테스트', () => {
    let accessToken = 'Bearer ';

    test('성공 케이스', async () => {
      const response = await supertest(app).post('/auth/login').send({
        email: 'goguma@yummy.com',
        password: 'P4$$W0RD',
      });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('로그인에 성공했습니다.');

      expect(response.body.accessToken).toMatch(
        /^[\w\d-_]+\.[\w\d-_]+\.[\w\d-_]+$/,
      );

      accessToken += response.body.accessToken;
    });

    test('실패 케이스 - 이미 로그인한 상태', async () => {
      const response = await supertest(app)
        .post('/auth/login')
        .set('authorization', accessToken)
        .send({
          email: 'goguma@yummy.com',
          password: 'P4$$W0RD',
        });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        errorMessage: '이미 로그인이 되어있습니다.',
      });
    });

    test('실패 케이스 - body가 존재하지 않음', async () => {
      const response = await supertest(app).post('/auth/login').send({});

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        errorMessage: '잘못된 요청입니다.',
      });
    });
  });
});

afterAll(async () => {
  if (process.env.NODE_ENV === 'test') await sequelize.sync({ force: true });
  else throw new Error('테스트 환경이 아닙니다!');
});
