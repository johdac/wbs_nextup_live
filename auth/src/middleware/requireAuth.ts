import type { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { ACCESS_JWT_SECRET } from "#config";
import { User } from "#models";

const requireAuth: RequestHandler = async (req, res, next) => {
  const authHeader = req.header("authorization");
  console.log("authHeader:", authHeader);
  const accessToken = authHeader && authHeader.split(" ")[1];
  if (!accessToken) throw Error("Please sign in", { cause: { status: 401 } });

  try {
    const decoded = jwt.verify(accessToken, ACCESS_JWT_SECRET) as jwt.JwtPayload;
    console.log(decoded);

    if (!decoded.sub)
      throw new Error("Invalid or expired access token", {
        cause: { status: 401 },
      });

    const user = await User.findById(decoded.sub);

    if (!user) throw new Error("User not found", { cause: { status: 404 } });

    req.user = user;

    next();
  } catch (error) {
    next(
      new Error("Unauthorized", {
        cause: { status: 401 },
      }),
    );
  }
};

export default requireAuth;
