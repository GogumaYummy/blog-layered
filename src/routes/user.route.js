const { Router } = require('express');
const UserController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth');

const router = Router();

const userController = new UserController();

router.post('/register', authMiddleware.isNotLoggedIn, userController.register);
router.post('/login', authMiddleware.isNotLoggedIn, userController.login);

module.exports = router;
