import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import { IExpressRequest } from "src/types/expressRequest.interface";
import UserModel from "../models/user";
import { secret } from "../config";

export const authMiddleware = async (req: IExpressRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader) {
      const token = authHeader.split(" ")[1];
      const data = jwt.verify(token, secret) as { id: string; email: string };
      const user = await UserModel.findById(data.id);
      if (user) {
        req.user = user;
        next();
      } else res.sendStatus(401);
    } else res.sendStatus(401);
  } catch (err) {
    res.sendStatus(401);
  }
};
