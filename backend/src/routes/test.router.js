import express from "express";
import expressAsyncHandler from "express-async-handler";
import {authGuard} from "../milddlewares/authGuard.js";

const testRouter = express.Router();

testRouter.get('/user-info', expressAsyncHandler(authGuard), expressAsyncHandler(async (req, res) => {
  return res.json({
    ...req?.user,
  })
}))
export default testRouter;