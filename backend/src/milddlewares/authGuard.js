import createHttpError from "http-errors";
import { httpAuthService } from "../services/index.js";

export async function authGuard (req, res, next) {
  if (!req.headers.authorization) {
    throw new createHttpError.Unauthorized('Вы не авторизованы');
  }
  const token = req.headers.authorization.split(' ')[1];
  let authRes;
  try {
    authRes = await httpAuthService.currentUser({ bearerToken: token });
  } catch (e) {
    throw new createHttpError.Unauthorized('Вы не авторизованы');
  }

  if (!authRes) {
    throw new createHttpError.Unauthorized('Вы не авторизованы');
  }
  req.user = authRes.user;
  next();
}