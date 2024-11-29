import express from "express";
import testRouter from "./test.router.js";

const globalRouter = express.Router();

globalRouter.use('/test', testRouter);

export default globalRouter;