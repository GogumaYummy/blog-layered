const { Router } = require('express');
const logger = require('../config/logger');
const UserController = require('../controllers/user.controller');

const router = Router();

const userController = new UserController();

router.post('/register', userController.register);

module.exports = router;
