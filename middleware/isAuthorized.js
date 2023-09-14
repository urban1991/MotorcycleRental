const AppError = require("../utils/AppError");

const isAuthorized =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          "You don't have permissions to access this resources",
          403,
        ),
      );
    }
    next();
  };

module.exports = {isAuthorized};
