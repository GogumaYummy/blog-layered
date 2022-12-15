const AuthRepository = require('../../../src/repositories/auth.repository');
const { ValidationError } = require('sequelize');

const mockDB = [
  {
    email: 'goguma@yummy.com',
    userId: 1,
    nickname: 'GogumaYum',
  },
];
const mockUsersModel = {
  create: jest.fn(),
  findOne: jest.fn(),
};

const authRepository = new AuthRepository(mockUsersModel);

describe('AuthRepository 클래스 단위 데스트', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mockUsersModel.create = jest.fn(({ email, nickname, password }) => {
      if (
        !email ||
        typeof email !== 'string' ||
        !nickname ||
        typeof nickname !== 'string' ||
        !password ||
        typeof password !== 'string'
      )
        throw new ValidationError();
    });
    mockUsersModel.findOne = jest.fn(({ where }) => {
      let result;
      mockDB.forEach((model) => {
        if (model.email === where.email) result = model;
      });
      return result;
    });
  });

  describe('createUser 메소드 실행 테스트', () => {
    test('성공 케이스', async () => {
      await authRepository.createUser(
        'goguma@yummy.com',
        'GogumaYum',
        'P4$$W0RD',
      );

      expect(authRepository.usersModel.create).toHaveBeenCalledWith({
        email: 'goguma@yummy.com',
        nickname: 'GogumaYum',
        password: 'P4$$W0RD',
      });
      expect(authRepository.usersModel.create).toHaveBeenCalledTimes(1);
    });

    test('실패 케이스 - 인자 빠짐', async () => {
      try {
        await authRepository.createUser('goguma@yummy.com', 'GogumaYum');
      } catch (err) {
        expect(err.constructor).toBe(ValidationError);

        expect(authRepository.usersModel.create).toHaveBeenCalledWith({
          email: 'goguma@yummy.com',
          nickname: 'GogumaYum',
          password: undefined,
        });
        expect(authRepository.usersModel.create).toHaveBeenCalledTimes(1);
      }
    });

    test('실패 케이스 - 잘못된 인자', async () => {
      try {
        await authRepository.createUser('goguma@yummy.com', 'GogumaYum', 1234);
      } catch (err) {
        expect(err.constructor).toBe(ValidationError);

        expect(authRepository.usersModel.create).toHaveBeenCalledWith({
          email: 'goguma@yummy.com',
          nickname: 'GogumaYum',
          password: 1234,
        });
        expect(authRepository.usersModel.create).toHaveBeenCalledTimes(1);
      }
    });
  });

  describe('getUserByEmail 메소드 실행 테스트', () => {
    test('성공 케이스', async () => {
      const user = await authRepository.getUserByEmail('goguma@yummy.com');

      expect(authRepository.usersModel.findOne).toHaveBeenCalledWith({
        where: { email: 'goguma@yummy.com' },
      });
      expect(authRepository.usersModel.findOne).toHaveBeenCalledTimes(1);

      expect(user).toEqual(mockDB[0]);
    });

    test('실패 케이스 - 빈 문자열', async () => {
      const user = await authRepository.getUserByEmail('');

      expect(authRepository.usersModel.findOne).toHaveBeenCalledWith({
        where: { email: '' },
      });
      expect(authRepository.usersModel.findOne).toHaveBeenCalledTimes(1);

      expect(user).toBe(undefined);
    });

    test('실패 케이스 - 인자 없음', async () => {
      const user = await authRepository.getUserByEmail();

      expect(authRepository.usersModel.findOne).toHaveBeenCalledWith({
        where: { email: undefined },
      });
      expect(authRepository.usersModel.findOne).toHaveBeenCalledTimes(1);

      expect(user).toBe(undefined);
    });

    test('실패 케이스 - 가입되지 않은 이메일', async () => {
      const user = await authRepository.getUserByEmail('foo@bar.com');

      expect(authRepository.usersModel.findOne).toHaveBeenCalledWith({
        where: { email: 'foo@bar.com' },
      });
      expect(authRepository.usersModel.findOne).toHaveBeenCalledTimes(1);

      expect(user).toBe(undefined);
    });
  });
});
