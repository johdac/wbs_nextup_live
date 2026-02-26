import jwt from "jsonwebtoken";
import type { RequestHandler } from "express";

const ACCESS_JWT_SECRET = process.env.ACCESS_JWT_SECRET;
if (!ACCESS_JWT_SECRET) {
  // Hard fail stopping the server
  process.exit(1);
}

export const authenticate: RequestHandler = (req, _res, next) => {
  const authHeader = req.header("authorization");
  const accessToken = authHeader && authHeader.split(" ")[1];
  if (!accessToken)
    throw new Error("Please sign in", { cause: { status: 401 } });
  try {
    const decoded = jwt.verify(
      accessToken,
      ACCESS_JWT_SECRET,
    ) as jwt.JwtPayload;
    if (!decoded.sub)
      throw new Error("Invalid or expired access token", {
        cause: { status: 401 },
      });
    const user = {
      id: decoded.sub,
      roles: decoded.roles,
    };
    req.user = user;
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      next(
        new Error("Expired access token", {
          cause: { status: 401, code: "ACCES_TOKEN_EXPIRED" },
        }),
      );
    } else {
      next(new Error("Invalid access token.", { cause: { status: 401 } }));
    }
  }
};
