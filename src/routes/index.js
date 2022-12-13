const { Router } = require('express');
const { ApiError } = require('../utils/apiError');

const router = Router();

const postsRouter = require('./posts.route.js');

router.use('/posts', [postsRouter]);

router.get('/', (req, res) => res.send('Hi'));

module.exports = router;
