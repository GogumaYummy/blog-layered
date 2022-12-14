const Joi = require('joi');

const AuthService = require('../services/auth.service');
const { ApiError } = require('../utils/apiError');

class AuthController {
  constructor() {
    this.authService = new AuthService();
  }
  /**
   * A middleware to register.
   * @param {import('express').Request} req - Request of Express.js
   * @param {import('express').Response} res - Response of Express.js
   * @param {import('express').NextFunction} next - Next function of Express.js
   */
  register = async (req, res, next) => {
    try {
      Joi.object()
        .keys({
          email: Joi.string().email().required(),
          nickname: Joi.string()
            .regex(/^[A-Za-z각-힣\d]{3,10}$/)
            .required(),
          password: Joi.string().min(4).max(16).required(),
        })
        .validate(req.body);

      const { email, nickname, password, confirm } = req.body;

      await this.authService.register(email, nickname, password, confirm);

      res.status(200).json({ message: '회원 가입에 성공했습니다.' });
    } catch (err) {
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
      await Joi.object()
        .keys({
          email: Joi.string().required(),
          password: Joi.string().required(),
        })
        .validateAsync(req.body);

      const { email, password } = req.body;

      const accessToken = await this.authService.login(email, password);

      await Joi.string()
        .regex(/^[\w\d]+\.[\w\d]+\.[\w\d]+$/)
        .validateAsync(accessToken);

      res.status(200).json({ message: '로그인에 성공했습니다.', accessToken });
    } catch (err) {
      next(err);
    }
  };
}

module.exports = AuthController;
