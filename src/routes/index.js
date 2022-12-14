const { Router } = require('express');
const { ApiError } = require('../utils/apiError');
const userRouter = require('./user.route');

const router = Router();

router.get('/', (req, res) => res.send('Hi'));
router.use('/users', userRouter);

module.exports = router;
