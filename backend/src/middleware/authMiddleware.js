import { verifyAccessToken } from "../utils/jwt.js";

export const protect = (req, res, next) => {
  try {
    const token = req.cookies.accessToken;
    //console.log(token);
    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token expired" });
  }
};
