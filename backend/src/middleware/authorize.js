export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    try {
      // chua login
      if (!req.user) {
        return res.status(401).json({
          message: "Not authenticated",
        });
      }

      // check role
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({
          message: `Role ${req.user.role} is not allowed`,
        });
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
