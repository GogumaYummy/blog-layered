const logger = require('../config/logger');
const UserService = require('../services/user.service');
const { ApiError } = require('../utils/apiError');

class UserController {
  constructor() {
    this.userService = new UserService();
  }
  /**
   * A middleware to register.
   * @param {import('express').Request} req - Request of Express.js
   * @param {import('express').Response} res - Response of Express.js
   * @param {import('express').NextFunction} next - Next function of Express.js
   */
  register = async (req, res, next) => {
    try {
      const { email, nickname, password, confirm } = req.body;

      //TODO: joi로 대체할 예정
      if (!email || !nickname || !password || !confirm)
        throw new ApiError('잘못된 요청입니다.', 400);

      await this.userService.register(email, nickname, password, confirm);

      res.status(200).json({ message: '회원 가입에 성공했습니다.' });
    } catch (err) {
      next(err);
    }
  };
}

module.exports = UserController;
