const { Router } = require('express');
const { ApiError } = require('../utils/apiError');

const router = Router();

router.get('/', (req, res) => res.send('Hi'));

module.exports = router;
