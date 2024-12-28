exports.roleMiddleware = (...allowedRoles) => {
  return (req, res, next) => {
    const { role } = req.user; // User role from the JWT payload

    if (!allowedRoles.includes(role)) {
      return res.status(403).json({
        message: "Access denied. You do not have the required permissions.",
      });
    }

    next();
  };
};
