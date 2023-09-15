const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {User} = require("../models/user");
const {tryCatchFn} = require("../utils/tryCatchFn");
const AppError = require("../utils/AppError");
const {sendEmail} = require("../utils/sendEmail");

function signToken(userId) {
  return jwt.sign({id: userId}, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
}

function createSendToken(user, statusCode, res) {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
  };

  res.cookie("jwt", token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
}

const signUp = tryCatchFn(async (req, res) => {
  const newUser = await User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    role: req.body.role,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    driverLicenseNumber: req.body.driverLicenseNumber,
    phoneNumber: req.body.phoneNumber,
    dateOfBirth: req.body.dateOfBirth,
    address: req.body.address,
    avatarUrl: req.body.avatarUrl,
  });

  createSendToken(newUser, 201, res);
});

const login = tryCatchFn(async (req, res, next) => {
  const {email, password} = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }

  const user = await User.findOne({email}).select("+password");
  const isPasswordCorrect = user
    ? await user.comparePasswords(password, user.password)
    : false;

  if (!user || !isPasswordCorrect) {
    return next(new AppError("Incorrect email address or password", 401));
  }

  createSendToken(user, 200, res);
});

const forgotPassword = tryCatchFn(async (req, res, next) => {
  const user = await User.findOne({email: req.body.email});

  if (!user) {
    return next(new AppError("There is no user with given email address", 404));
  }

  const resetToken = user.generatePasswordResetToken();
  await user.save({validateBeforeSave: false});

  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetUrl}
   \nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: req.body.email,
      subject: "Your password reset token (valid for 10 minutes)",
      message,
    });

    res.status(200).json({
      status: "success",
      message: "Token sent to email!",
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpirationDate = undefined;

    await user.save({validateBeforeSave: false});
    return next(
      new AppError(
        "There was an error sending the email. Try again later!",
        500
      )
    );
  }
});

const resetPassword = tryCatchFn(async (req, res, next) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetTokenExpirationDate: {$gt: Date.now()},
  });

  if (!user) {
    return next(new AppError("Token is invalid or has expired", 400));
  }

  user.password = req.body.password;
  user.confirmPassword = req.body.confirmPassword;
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpirationDate = undefined;
  await user.save();

  createSendToken(user, 200, res);
});

const updatePassword = tryCatchFn(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  if (!user) {
    return next(new AppError("There is no user with given email address", 404));
  }

  const isPasswordCorrect = await user.comparePasswords(
    req.body.passwordCurrent,
    user.password
  );

  if (isPasswordCorrect) {
    user.password = req.body.passwordNew;
    user.confirmPassword = req.body.passwordNewConfirm;
    await user.save();
  }

  createSendToken(user, 200, res);
});

module.exports = {signUp, login, forgotPassword, resetPassword, updatePassword};
