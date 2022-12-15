const { Router } = require('express');
const { ApiError } = require('../utils/apiError');
const authRouter = require('./auth.route');

const router = Router();

const postsRouter = require('./posts.route.js');
const likesRouter = require('./likes.route');

router.use('/posts', [postsRouter]);
router.use('/like', likesRouter);

router.get('/', (req, res) => res.send('Hi'));
router.use('/auth', authRouter);

module.exports = router;
