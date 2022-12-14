const { Router } = require('express');
const { ApiError } = require('../utils/apiError');
const authRouter = require('./auth.route');

const router = Router();

router.get('/', (req, res) => res.send('Hi'));
router.use('/auth', authRouter);

module.exports = router;
