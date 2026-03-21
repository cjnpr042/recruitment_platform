import bcrypt from "bcryptjs";
import User from "../models/user.js";
import RefreshTokenModel from "../models/refreshToken.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.js";

// register
export const registerService = async ({ email, password, role }) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !password || !role) {
    throw new Error("Missing required fields");
  }
  if (!emailRegex.test(email)) {
    throw { message: "Invalid email format", status: 400 };
  }

  if (password.length < 6) {
    throw { message: "Password must be at least 6 characters", status: 400 };
  }
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("Email already exists");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    email,
    password: hashedPassword,
    role,
  });
  return {
    id: user._id,
    email: user.email,
    role: user.role,
  };
};
//login
export const loginService = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw { message: "Invalid credentials", status: 400 };
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw { message: "Invalid credentials", status: 400 };
  }
  if (user.isBlocked) {
    throw { message: "User is blocked", status: 403 };
  }
  const payload = {
    userId: user._id,
    role: user.role,
  };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);
  await RefreshTokenModel.create({
    userId: user._id,
    token: refreshToken,
    expireAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  return {
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      email: user.email,
      role: user.role,
    },
  };
};
// refresh token service
export const refreshTokenService = async (token) => {
  if (!token) {
    throw { message: "No token", status: 401 };
  }
  const decoded = verifyRefreshToken(token);
  const stored = await RefreshTokenModel.findOne({ token });

  if (!stored) {
    throw { message: "Invalid refresh token", status: 403 };
  }

  if (stored.expireAt < new Date()) {
    throw { message: "Refresh token expired", status: 403 };
  }

  const newAccessToken = generateAccessToken({
    userId: decoded.userId,
    role: decoded.role,
  });
  return { accessToken: newAccessToken };
};

//logout
export const logoutService = async (token) => {
  if (token) {
    await RefreshTokenModel.deleteOne({ token });
  }
};
