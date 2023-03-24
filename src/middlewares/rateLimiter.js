const rateLimit = require('express-rate-limit');

const rateLimiter = rateLimit({
  windowMs: 10 * 1000,
  max: 10,
  message: '10초에 10번만 요청할 수 있습니다.',
});

module.exports = rateLimiter;
