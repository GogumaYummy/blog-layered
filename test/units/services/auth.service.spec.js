const AuthService = require('../../../src/services/auth.service');
const { ApiError } = require('../../../src/utils/apiError');

const mockDB = [
  {
    email: 'goguma@yummy.com',
    userId: 1,
    nickname: 'GogumaYum',
    password: 'H4$H31D_P4$$W0RD',
  },
];
const mockAuthRepository = {
  createUser: jest.fn(),
  getUserByEmail: jest.fn(),
};
const mockBcrypt = {
  hash: jest.fn(),
  compare: jest.fn(),
};
const mockJwt = {
  sign: jest.fn(),
};
const authService = new AuthService(mockBcrypt, mockJwt);
authService.authRepository = mockAuthRepository;

describe('AuthService 클래스 단위 테스트', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mockAuthRepository.getUserByEmail = jest.fn((email) => {
      let result;
      mockDB.forEach((model) => {
        if (model.email === email) result = model;
      });
      return result;
    });
    mockBcrypt.hash = jest.fn((password, salt) => 'H4$H31D_' + password);
    mockBcrypt.compare = jest.fn(
      (password, hashedPassword) => hashedPassword === 'H4$H31D_' + password,
    );
    mockJwt.sign = jest.fn(
      (payload, secretOrPrivateKey, options) => 'Hi.Im.Token',
    );
  });

  describe('register 메소드 실행 테스트', () => {
    test('성공 케이스', async () => {
      await authService.register(
        'foo@bar.com',
        'GogumaYum',
        'P4$$W0RD',
        'P4$$W0RD',
      );

      expect(authService.authRepository.getUserByEmail).toBeCalledWith(
        'foo@bar.com',
      );
      expect(authService.authRepository.getUserByEmail).toBeCalledTimes(1);
      expect(authService.authRepository.getUserByEmail).toReturnWith(undefined);

      expect(authService.bcrypt.hash).toBeCalledTimes(1);

      expect(authService.authRepository.createUser).toBeCalledWith(
        'foo@bar.com',
        'GogumaYum',
        'H4$H31D_P4$$W0RD',
      );
      expect(authService.authRepository.createUser).toBeCalledTimes(1);
    });

    test('실패 케이스 - 비밀번호 확인 불일치', async () => {
      try {
        await authService.register(
          'goguma@yummy.com',
          'GogumaYum',
          'P4$$W0RD',
          'WR0N@_P4$$W0RD',
        );
      } catch (err) {
        expect(err.constructor).toBe(ApiError);
      }
    });

    test('실패 케이스 - 가입된 이메일', async () => {
      try {
        await authService.register(
          'goguma@yummy.com',
          'GogumaYum',
          'P4$$W0RD',
          'P4$$W0RD',
        );
      } catch (err) {
        expect(err.constructor).toBe(ApiError);

        expect(authService.authRepository.getUserByEmail).toBeCalledWith(
          'goguma@yummy.com',
        );
        expect(authService.authRepository.getUserByEmail).toBeCalledTimes(1);
      }
    });
  });

  describe('login 메소드 실행 테스트', () => {
    test('성공 케이스', async () => {
      const accessToken = await authService.login(
        'goguma@yummy.com',
        'P4$$W0RD',
      );

      expect(authService.authRepository.getUserByEmail).toBeCalledWith(
        'goguma@yummy.com',
      );
      expect(authService.authRepository.getUserByEmail).toBeCalledTimes(1);
      expect(authService.authRepository.getUserByEmail).toReturnWith({
        email: 'goguma@yummy.com',
        userId: 1,
        nickname: 'GogumaYum',
        password: 'H4$H31D_P4$$W0RD',
      });

      expect(authService.bcrypt.compare).toBeCalledTimes(1);

      expect(accessToken).toBe('Hi.Im.Token');
    });

    test('실패 케이스 - 가입되지 않은 이메일', async () => {
      try {
        const accessToken = await authService.login('foo@bar.com', 'P4$$W0RD');
      } catch (err) {
        expect(authService.authRepository.getUserByEmail).toBeCalledWith(
          'foo@bar.com',
        );

        expect(authService.authRepository.getUserByEmail).toBeCalledTimes(1);
        expect(authService.authRepository.getUserByEmail).toReturnWith(
          undefined,
        );

        expect(err.constructor).toBe(ApiError);
      }
    });

    test('실패 케이스 - 잘못된 비밀번호', async () => {
      try {
        const accessToken = await authService.login(
          'goguma@yummy.com',
          'WR0N@_P4$$W0RD',
        );
      } catch (err) {
        expect(authService.authRepository.getUserByEmail).toBeCalledWith(
          'goguma@yummy.com',
        );

        expect(authService.authRepository.getUserByEmail).toBeCalledTimes(1);
        expect(authService.authRepository.getUserByEmail).toReturnWith({
          email: 'goguma@yummy.com',
          userId: 1,
          nickname: 'GogumaYum',
          password: 'H4$H31D_P4$$W0RD',
        });

        expect(authService.bcrypt.compare).toBeCalledTimes(1);

        expect(err.constructor).toBe(ApiError);
      }
    });
  });
});
