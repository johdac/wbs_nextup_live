/* For custom types used in more than one module */
import type { Request } from "express";
import type { IUser } from "#models";
import type { Document } from "mongoose";

declare global {
  namespace Express {
    interface Request {
      user?: Document & IUser;
    }
  }
}
