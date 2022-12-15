const { Router } = require('express');
const authRouter = require('./auth.route');
const postsRouter = require('./posts.route.js');
const likesRouter = require('./likes.route');

const router = Router();

router.get('/', (req, res) => res.send('Hi'));
router.use('/auth', authRouter);
router.use('/posts', postsRouter);
router.use('/like', likesRouter);

module.exports = router;
