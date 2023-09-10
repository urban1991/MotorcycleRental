const jwt = require("jsonwebtoken");
const {promisify} = require("util");
const {tryCatchFn} = require("../utils/tryCatchFn");
const AppError = require("../utils/AppError");
const {User} = require("../models/user");

const isLoggedIn = tryCatchFn(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new AppError("Unauthorized access, please log in to see resources", 401));
  }

  const decodedToken = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  try {
    const userFromToken = await User.findById(decodedToken.id);

    if (!userFromToken) {
      return next(new AppError("Owner of this token does not longer exist", 401));
    }

    if (userFromToken.changedPasswordAfter(decodedToken.iat)) {
      return next(new AppError("Password has been changed, please log in again", 401));
    }

    req.user = userFromToken;
  } catch (e) {
    // TODO: implement error controller
    return new AppError("Something went wrong", 400);
  }

  next();
});

module.exports = {isLoggedIn};
