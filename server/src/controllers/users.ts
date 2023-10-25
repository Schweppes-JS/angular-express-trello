import { Request, Response, NextFunction } from "express";
import { Error } from "mongoose";
import jwt from "jsonwebtoken";

import { UserDocument } from "src/types/user.interface";
import UserModel from "../models/user";
import { secret } from "../config";

const normilizeUser = ({ email, username, id }: UserDocument) => {
  const token = jwt.sign({ id, email }, secret);
  return { email, username, id, token };
};

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newUser = new UserModel({ email: req.body.email, username: req.body.username, password: req.body.password });
    const savedUser = await newUser.save();
    res.send(normilizeUser(savedUser));
  } catch (err) {
    if (err instanceof Error.ValidationError) {
      const messages = Object.values(err.errors).map((err) => err.message);
      return res.status(422).json(messages);
    }
    next(err);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email }).select("+password");
    const errors = { emailOrPassword: "Incorect password or email" };
    if (user) {
      const isSamePassword = await user.validatePassword(req.body.password);
      console.log(isSamePassword);
      if (!isSamePassword) {
        return res.status(422).json(errors);
      }
      res.send(normilizeUser(user));
    } else return res.status(422).json(errors);
  } catch (err) {
    if (err instanceof Error.ValidationError) {
      const messages = Object.values(err.errors).map((err) => err.message);
      return res.status(422).json(messages);
    }
    next(err);
  }
};
