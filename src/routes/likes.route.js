const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth');

const LikesController = require('../controllers/like.controller.js');

const LikesControllers = new LikesController();

router.post(
  '/posts/:postId',
  authMiddleware.isLoggedIn,
  LikesControllers.postlike,
);
router.delete(
  '/posts/:postId',
  authMiddleware.isLoggedIn,
  LikesControllers.deletdlike,
);
router.get(
  '/:userId/liked',
  authMiddleware.isLoggedIn,
  LikesControllers.getlikelist,
);

module.exports = router;
