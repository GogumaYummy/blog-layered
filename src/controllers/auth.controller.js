const AuthService = require('../services/auth.service');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {
  registerRequestSchema,
  loginRequestSchema,
  loginResponseSchema,
} = require('../validations/auth.validation');

class AuthController {
  constructor() {
    this.authService = new AuthService(bcrypt, jwt);
  }
  /**
   * A middleware to register.
   * @param {import('express').Request} req - Request of Express.js
   * @param {import('express').Response} res - Response of Express.js
   * @param {import('express').NextFunction} next - Next function of Express.js
   */
  register = async (req, res, next) => {
    try {
      const { email, nickname, password, confirm } =
        await registerRequestSchema.validateAsync(req.body);

      await this.authService.register(email, nickname, password, confirm);

      res.status(200).json({ message: '회원 가입에 성공했습니다.' });
    } catch (err) {
      console.log(err);
      next(err);
    }
  };

  /**
   * A middleware to get an access token by logging in.
   * @param {import('express').Request} req - Request of Express.js
   * @param {import('express').Response} res - Response of Express.js
   * @param {import('express').NextFunction} next - Next function of Express.js
   */
  login = async (req, res, next) => {
    try {
      const { email, password } = await loginRequestSchema.validateAsync(
        req.body,
      );

      const accessToken = await this.authService.login(email, password);

      await loginResponseSchema.validateAsync(accessToken);

      res.status(200).json({ message: '로그인에 성공했습니다.', accessToken });
    } catch (err) {
      next(err);
    }
  };
}

module.exports = AuthController;
