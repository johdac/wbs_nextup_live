import jwt from "jsonwebtoken";
import type { RequestHandler } from "express";
import { Types } from "mongoose";

/**
 * We use this optional authentication middleware when we might want to enrich response data with
 * data that is only available for logged in users. Not logged in users should still have access
 * though, which would be blocked by the authenticate middleware.
 */

const ACCESS_JWT_SECRET = process.env.ACCESS_JWT_SECRET;
if (!ACCESS_JWT_SECRET) {
  // Hard fail stopping the server
  process.exit(1);
}

export const optionalAuthenticate: RequestHandler = (req, _res, next) => {
  const authHeader = req.header("authorization");
  const accessToken = authHeader?.split(" ")[1];

  if (!accessToken) {
    next();
    return;
  }

  try {
    const decoded = jwt.verify(
      accessToken,
      ACCESS_JWT_SECRET,
    ) as jwt.JwtPayload;

    if (!decoded.sub) {
      next();
      return;
    }

    req.user = {
      id: new Types.ObjectId(decoded.sub),
      roles: decoded.roles,
    };
  } catch {
    // ignore invalid / expired tokens
  }

  next();
};
