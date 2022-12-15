const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const cookieParser = require('cookie-parser');
const { urlencoded } = require('express');
const morgan = require('morgan');
const api = require('./routes');
const logger = require('./config/logger');
const db = require('./models');
const rateLimiter = require('./middlewares/rateLimiter');
const {
  errorConverter,
  errorLogger,
  errorHandler,
} = require('./middlewares/error');

const { PORT } = process.env;

const app = express();

db.sequelize
  .sync({ force: false, alter: false })
  .then(() => {
    logger.info('MySQL connect success');
  })
  .catch((err) => {
    logger.error(err.message);
  });

app.use(
  morgan(env === 'production' ? 'combined' : 'dev', { stream: logger.stream }),
);
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());
app.use(cors());
app.use(rateLimiter);

app.use('/', api);

app.use(errorLogger);
app.use(errorConverter);
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`${PORT} 포트로 서버가 열렸습니다.`);
});

module.exports = app;
