import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import cookieParser from "cookie-parser";
import compression from "compression";
import fileUpload from "express-fileupload";
import logger from "./configs/logger.js";
import createHttpError from "http-errors";
import expressAsyncHandler from "express-async-handler";
import globalRouter from "./routes/index.js";

dotenv.config();

const app = express();

const DB_CONNECTION_STRING = process.env.MONGO_URI;
const PORT = process.env.NODE_PORT;

/**
 * $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
 * MIDDLEWARES
 * $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
 */

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'))
}
app.use(helmet());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(mongoSanitize());
app.use(cookieParser());
app.use(compression());
app.use(fileUpload({
  useTempFiles: true,
}));

/**
 * $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
 * ROUTES
 * $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
 */

app.use(globalRouter);

app.post('*', expressAsyncHandler(async (req, res, next) => {
  const message = `Маршрут не существует`;
  throw createHttpError.NotFound(message);
}))
/**
 * $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
 * ERROR HANDLER
 * $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
 */

app.use((err, req, res, next) => {
  if (err) {
    const statusCode = err.status || 500;
    res.status(statusCode);
    return res.json({
      success: false,
      status_code: statusCode,
      messsage: err.message,
      data: null,
    })
  }
})

const server = app.listen(PORT, () => {
  logger.info(`Process with with ${process.pid} is running`);
  logger.info(`Server is listening on port ${PORT}`);
});

const exitHandler = () => {
  if (server) {
    logger.info("Server closed");
    process.exit(1)
  } else {
    process.exit(1)
  }
}

const unexpectedErrorHandler = (e) => {
  logger.error(e)
  exitHandler();
}

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);
export default app;