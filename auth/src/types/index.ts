/* For custom types used in more than one module */
import type { Request } from "express";
import type { IUser } from "#models";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}
