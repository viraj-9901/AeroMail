import Jwt from "jsonwebtoken";
import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";
import { Types } from "mongoose";
import { ApiError } from "../utils/ApiError";
import { Auth } from "../models/auth.model";
import { RefreshTokens } from "../models/refresh_tokens";
import { config } from "../config/env";
import { JwtPayload } from "../types/jwt";

export const generateAccessAndRefreshToken = async (
  userId: Types.ObjectId
) => {
  const authUser = await Auth.findById(userId);

  if (!authUser) {
    throw new ApiError(404, "User not found");
  }

  const accessToken = authUser.generateAccessToken();
  const refreshToken = authUser.generateRefreshToken();

  return { accessToken, refreshToken };
};

export const registerUser = async (payload: {
  email: string;
  password: string;
}) => {
  const { email, password } = payload;

  if (!email || !password) {
    throw new ApiError(400, "Invalid email or password");
  }

  const existingUser = await Auth.findOne({ email });

  if (existingUser) {
    throw new ApiError(400, "User already exists");
  }

  const authUser = await Auth.create({
    email,
    password,
  });

  return authUser;
};

export const registerAdmin = async (payload: {
  email: string;
  password: string;
  secretKey: string;
}) => {
  const { email, password, secretKey } = payload;

  if (!email || !password || !secretKey) {
    throw new ApiError(400, "Invalid email or password");
  }

  const existingAdmin = await Auth.findOne({ email });

  if (existingAdmin) {
    throw new ApiError(400, "Admin already exists");
  }

  const authUser = await Auth.create({
    email,
    password,
    role: "Admin"
  });

  return authUser;
}

export const loginUser = async (
  loginIdentifier: string,
  password: string,
  meta: { ip?: string; userAgent?: string }
) => {
  const authUser = await Auth.findOne({
    $or: [
      { email: loginIdentifier },
      { referenceNumber: loginIdentifier },
    ],
  }).select("+password");

  if (!authUser) {
    throw new ApiError(400, "Invalid login identifier");
  }

  if (authUser.lockUntil && authUser.lockUntil > new Date()) {
    throw new ApiError(400, "User is locked, try later");
  }

  const isPasswordValid = await authUser.comparePassword(password);

  if (!isPasswordValid) {
    authUser.loginAttempts += 1;

    if (authUser.loginAttempts > 3) {
      authUser.lockUntil = new Date(Date.now() + 15 * 60 * 1000);
    }

    await authUser.save();
    throw new ApiError(400, "Invalid password");
  }

  authUser.loginAttempts = 0;
  authUser.lockUntil = undefined;
  await authUser.save();

  const { accessToken, refreshToken } =
    await generateAccessAndRefreshToken(authUser._id);

  const decoded = Jwt.decode(refreshToken) as JwtPayload;
  const expiredAt = decoded?.exp
    ? new Date(decoded.exp * 1000)
    : undefined;

  await RefreshTokens.findOneAndUpdate(
    { authUserId: authUser._id },
    {
      refreshToken,
      expiredAt,
      ipAddress: meta.ip,
      userAgent: meta.userAgent,
    },
    { upsert: true, new: true }
  );

  const user = await Auth.findById(authUser._id).select("-password");

  return { user, accessToken, refreshToken };
};

export const logoutUser = async (userId: Types.ObjectId) => {
  await RefreshTokens.findOneAndDelete({ authUserId: userId });
};

export const forgotPassword = async (email: string) => {
  const authUser = await Auth.findOne({ email });

  if (!authUser) {
    throw new ApiError(400, "Invalid email");
  }

  const resetToken = crypto.randomUUID();
  const resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000);

  authUser.resetToken = resetToken;
  authUser.resetTokenExpiry = resetTokenExpiry;

  await authUser.save();

  return resetToken; // send via email later
};

export const resetPassword = async (
  email: string,
  resetToken: string,
  password: string
) => {
  const authUser = await Auth.findOne({ email });

  if (!authUser) {
    throw new ApiError(400, "Invalid email");
  }

  if (
    authUser.resetToken !== resetToken ||
    authUser.resetTokenExpiry! < new Date()
  ) {
    throw new ApiError(400, "Invalid or expired reset token");
  }

  authUser.password = password;
  authUser.resetToken = undefined;
  authUser.resetTokenExpiry = undefined;

  await authUser.save();
};

export const refreshAccessToken = async (
  incomingRefreshToken: string,
  meta: { ip?: string; userAgent?: string }
) => {
  const decoded = Jwt.verify(
    incomingRefreshToken,
    config.REFRESH_TOKEN_SECRET
  ) as JwtPayload;

  const authUser = await Auth.findById(decoded._id);

  if (!authUser) {
    throw new ApiError(401, "Invalid refresh token");
  }

  const tokens = await generateAccessAndRefreshToken(authUser._id);

  const expiredAt = decoded.exp
    ? new Date(decoded.exp * 1000)
    : undefined;

  await RefreshTokens.findOneAndUpdate(
    { authUserId: authUser._id },
    {
      refreshToken: tokens.refreshToken,
      expiredAt,
      ipAddress: meta.ip,
      userAgent: meta.userAgent,
    },
    { upsert: true, new: true }
  );

  return tokens;
};
