import {
  registerService,
  loginService,
  refreshTokenService,
  logoutService,
} from "../services/authService.js";

//register
export const register = async (req, res) => {
  try {
    const user = await registerService(req.body);
    res.status(201).json({
      message: "Register successfull",
      user,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

/// fix cookie sau secure:
// process.env.NODE_ENV === "production",
// sameSite: "lax",

//login
export const login = async (req, res, next) => {
  try {
    const data = await loginService(req.body);
    res.cookie("accessToken", data.accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });
    res.cookie("refreshToken", data.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.json({
      message: "Login success",
      user: data.user,
      accessToken: data.accessToken,
    });
  } catch (error) {
    next(error);
  }
};

// refreshToken controller
export const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    const data = await refreshTokenService(token);
    res.cookie("accessToken", data.accessToken, {
      httpOnly: true,
      maxAge: 15 * 60 * 1000,
    });
    res.json({ message: "Token refreshed" });
  } catch (error) {
    next(error);
  }
};

// logout
export const logout = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    await logoutService(token);
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out" });
  } catch (error) {
    next(error);
  }
};
