import type { RequestHandler } from "express";
import { ACCESS_JWT_SECRET, REFRESH_TOKEN_TTL, SALT_ROUNDS } from "#config";
import { User, RefreshToken } from "#models";
import bcrypt from "bcrypt";
import { assertExists, createTokens } from "#utils";
import jwt from "jsonwebtoken";
import type { registerSchema, loginSchema, refreshTokenSchema } from "#schemas";
import { z } from "zod";
import type { Types } from "mongoose";

type registerDTO = z.infer<typeof registerSchema>;
type loginDTO = z.infer<typeof loginSchema>;
type refreshTokenDTO = z.infer<typeof refreshTokenSchema>;
interface SuccessMessage {
  message: string;
}

interface TokenPairResponseDTO extends SuccessMessage {
  accessToken: string;
  refreshToken: string;
}

interface AuthTokenResponseDTO extends TokenPairResponseDTO {
  role: string;
}

type UserProfileDTO = {
  email: string;
  username: string;
  password?: string;
  _id: InstanceType<typeof Types.ObjectId>;
  role: string;
  createdAt: Date;
  updatedAt: Date;
};

type UpdateProfileDTO = {
  email?: string;
  username?: string;
  password?: string;
  role?: "user" | "organizer";
};

export const register: RequestHandler<{}, AuthTokenResponseDTO, registerDTO> = async (req, res) => {
  const { username, email, password, role } = req.body;
  const emailExists = await User.exists({ email });
  if (emailExists)
    throw new Error("The email is already registered", {
      cause: { status: 409 },
    });
  const usernameExists = await User.exists({ username });
  if (usernameExists)
    throw new Error("Username is already taken, choose another one!", {
      cause: { status: 409 },
    });

  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    email,
    password: hashedPassword,
    username,
    role,
  });

  const [refreshToken, accessToken] = await createTokens(user);
  if (!refreshToken || !accessToken) throw new Error("Promblem creating Tokens", { cause: { status: 500 } });
  res.status(201).json({
    message: `${username} Registered!`,
    accessToken,
    refreshToken,
    role: user.role,
  });
};

export const login: RequestHandler<{}, AuthTokenResponseDTO, loginDTO> = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");

  if (!user) throw new Error("Incorrect credentials", { cause: { status: 401 } });

  const match = await bcrypt.compare(password, user.password);

  if (!match) throw new Error("Incorrect credentials", { cause: { status: 401 } });
  await RefreshToken.deleteMany({ userId: user._id });
  // generate refresh and access tokens
  const [refreshToken, accessToken] = await createTokens(user);
  if (!refreshToken || !accessToken) throw new Error("Promblem creating Tokens", { cause: { status: 500 } });
  res.json({
    message: "Welcome back!",
    refreshToken,
    accessToken,
    role: user.role,
  });
};

export const refresh: RequestHandler<{}, TokenPairResponseDTO, refreshTokenDTO> = async (req, res) => {
  const { refreshToken } = req.body;
  const storedToken = await RefreshToken.findOne({ token: refreshToken });
  if (!storedToken) throw new Error("Please sign in again", { cause: { status: 403 } });
  await RefreshToken.findByIdAndDelete(storedToken._id);
  const user = await User.findById(storedToken.userId);
  if (!user) throw new Error("User account not found!", { cause: { status: 403 } });
  const [newRefreshToken, newAccessToken] = await createTokens(user);
  if (!newRefreshToken || !newAccessToken) throw new Error("Promblem creating Tokens", { cause: { status: 500 } });
  res.json({
    message: "Refreshed",
    refreshToken: newRefreshToken,
    accessToken: newAccessToken,
  });
};

export const logout: RequestHandler<{}, SuccessMessage, refreshTokenDTO> = async (req, res) => {
  const { refreshToken } = req.body;
  await RefreshToken.deleteOne({ token: refreshToken });
  res.json({ message: "You are signed out successfully! " });
};

export const me: RequestHandler<{}, UserProfileDTO> = async (req, res) => {
  const user = req.user;

  assertExists(user);

  const userObject = user.toObject();
  delete userObject.password;

  res.json(userObject);
};

export const update: RequestHandler<{}, any, UpdateProfileDTO> = async (req, res) => {
  const {
    body: { username, email, password, role },
    user,
  } = req;

  assertExists(user);

  if (username && username !== user.username) {
    const usernameExists = await User.exists({ username });
    if (usernameExists) {
      throw new Error("Username is already taken, choose another one!", {
        cause: { status: 409 },
      });
    }
    user.username = username;
  }

  if (email && email !== user.email) {
    const emailExists = await User.exists({ email });
    if (emailExists) {
      throw new Error("The email has already been taken", {
        cause: { status: 409 },
      });
    }
    user.email = email;
  }

  if (password) {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    user.password = await bcrypt.hash(password, salt);
  }

  if (role !== undefined) user.role = role;

  await user.save();

  const userObject = user.toObject();
  delete userObject.password;

  res.json(userObject);
};
