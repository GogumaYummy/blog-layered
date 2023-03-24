const AuthController = require('../../../src/controllers/auth.controller');
const { ApiError } = require('../../../src/utils/apiError');

const mockAuthService = {
  register: jest.fn(),
  login: jest.fn(),
};
let mockRequest = {};
const mockResponse = {
  status: jest.fn(),
  json: jest.fn(),
};
const mockNextFunction = jest.fn();

const authController = new AuthController();
authController.authService = mockAuthService;

describe('AuthController 클래스 단위 테스트', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mockAuthService.login = jest.fn((email, password) => 'Hi.Im.Token');
    mockRequest = {};
    mockResponse.status = jest.fn(() => mockResponse);
  });

  describe('register 메소드 실행 테스트', () => {
    test('성공 케이스', async () => {
      mockRequest.body = {
        email: 'goguma@yummy.com',
        nickname: 'GogumaYum',
        password: 'P4$$W0RD',
        confirm: 'P4$$W0RD',
      };

      await authController.register(
        mockRequest,
        mockResponse,
        mockNextFunction,
      );

      const { email, nickname, password, confirm } = mockRequest.body;

      expect(authController.authService.register).toBeCalledWith(
        email,
        nickname,
        password,
        confirm,
      );
      expect(authController.authService.register).toBeCalledTimes(1);

      expect(mockResponse.status).toBeCalledWith(200);
      expect(mockResponse.json).toBeCalledWith({
        message: '회원 가입에 성공했습니다.',
      });

      expect(mockNextFunction).not.toBeCalled();
    });

    test('실패 케이스 - body가 존재하지 않음', async () => {
      await authController.register(
        mockRequest,
        mockResponse,
        mockNextFunction,
      );

      expect(mockNextFunction).toBeCalled();
    });
  });

  describe('login 메소드 실행 테스트', () => {
    test('성공 케이스', async () => {
      mockRequest.body = {
        email: 'goguma@yummy.com',
        password: 'P4$$W0RD',
      };

      await authController.login(mockRequest, mockResponse, mockNextFunction);

      const { email, nickname, password } = mockRequest.body;

      expect(authController.authService.login).toBeCalledWith(email, password);
      expect(authController.authService.login).toBeCalledTimes(1);
      expect(authController.authService.login).toReturnWith('Hi.Im.Token');

      expect(mockResponse.status).toBeCalledWith(200);
      expect(mockResponse.json).toBeCalledWith({
        message: '로그인에 성공했습니다.',
        accessToken: 'Hi.Im.Token',
      });

      expect(mockNextFunction).not.toBeCalled();
    });

    test('실패 케이스 - body가 존재하지 않음', async () => {
      const accessToken = await authController.login(
        mockRequest,
        mockResponse,
        mockNextFunction,
      );

      expect(mockNextFunction).toBeCalled();
    });
  });
});
