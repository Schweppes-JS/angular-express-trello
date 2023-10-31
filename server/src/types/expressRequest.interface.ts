import { Request } from "express";

import { UserDocument } from "./user.interface";

export interface IExpressRequest extends Request {
  user?: UserDocument;
}
