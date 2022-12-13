const bcrypt = require('bcryptjs');
const logger = require('../config/logger');
const { Users } = require('../models');
const UserRepository = require('../repositories/user.repository');
const { ApiError } = require('../utils/apiError');

const PASSWORD_SALT = parseInt(process.env.PASSWORD_SALT);

class UserService {
  constructor() {
    this.userRepository = new UserRepository(Users);
  }
  /**
   * Create a new user if email is not exist .
   * @param {String} email - Email to login
   * @param {String} nickname - Nickname to display
   * @param {String} password - Password to login
   * @param {String} confirm - Confirm password
   */
  register = async (email, nickname, password, confirm) => {
    if (password !== confirm)
      throw new ApiError('비밀번호 확인이 일치하지 않습니다.', 400);

    const existUser = await this.userRepository.getUserByEmail(email);
    if (existUser) throw new ApiError('이미 가입된 이메일입니다.', 400);

    const hashedPassword = await bcrypt.hash(password, PASSWORD_SALT);

    await this.userRepository.createUser(email, nickname, hashedPassword);
  };
}

module.exports = UserService;
