const jwt = require("jsonwebtoken");
const {promisify} = require("util")
const {tryCatchFn} = require("../utils/tryCatchFn");
const AppError = require("../utils/AppError");

const isLoggedIn = tryCatchFn(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new AppError("Unauthorized access, please log in to see resources", 401))
  }

  const decodedToken = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  try {

  } catch (e) {
    // TODO: implement error controller
    return new AppError("Something went wrong", 400)
  }
  next();
});

module.exports = {isLoggedIn};
