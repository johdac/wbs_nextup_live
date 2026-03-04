import { randomUUID } from "node:crypto";
import type { Types } from "mongoose";
import jwt from "jsonwebtoken";
import { ACCESS_JWT_SECRET, ACCESS_TOKEN_TTL } from "#config";
import { RefreshToken } from "#models";

type UserData = {
  role: string;
  _id: Types.ObjectId;
};

const createTokens = async (userData: UserData) => {
  const payload = { roles: [userData.role] };
  const secret = ACCESS_JWT_SECRET;
  const tokenOptions = {
    expiresIn: ACCESS_TOKEN_TTL,
    subject: userData._id.toString(),
  };

  const accessToken = jwt.sign(payload, secret, tokenOptions);

  const refreshToken = randomUUID();

  await RefreshToken.create({
    token: refreshToken,
    userId: userData._id,
  });

  return [refreshToken, accessToken];
};

export default createTokens;
