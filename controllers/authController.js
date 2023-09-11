const jwt = require("jsonwebtoken");
const {User} = require("../models/user");
const {tryCatchFn} = require("../utils/tryCatchFn");
const AppError = require("./../utils/appError");
const {sendEmail} = require("./../utils/sendEmail");

function signToken(userId) {
  return jwt.sign({id: userId}, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
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
    avatarUrl: req.body.avatarUrl
  });

  const userToken = signToken(newUser._id);

  res.status(201).json({
    status: "success",
    token: userToken,
    data: {
      user: newUser
    }
  });
});

const login = tryCatchFn(async (req, res, next) => {
  const {email, password} = req.body;

  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }

  const user = await User.findOne({email}).select("+password");
  const isPasswordCorrect = user ? await user.comparePasswords(password, user.password) : false;

  if (!user || !isPasswordCorrect) {
    return next(new AppError("Incorrect email address or password", 401));
  }

  const userToken = signToken(user._id);

  res.status(200).json({
    status: "success",
    token: userToken
  });
});

const forgotPassword = tryCatchFn(async (req, res, next) => {
  const user = await User.findOne({email: req.body.email});

  if (!user) {
    return next(new AppError("There is no user with given email address", 404));
  }

  const resetToken = user.generatePasswordResetToken();
  await user.save({validateBeforeSave: false});

  const resetUrl = `${req.protocol}://${req.get("host")}/api/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetUrl}.
   \nIf you didn't forget your password, please ignore this email!`;

  try {

    await sendEmail({
      email: req.body.email,
      subject: "Your password reset token (valid for 10 minutes)",
      message
    });

    res.status(200).json({
      status: "success",
      message: "Token sent to email!"
    });
  } catch (err) {
    console.log(`err: `, err);
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpirationDate = undefined;
    await user.save({validateBeforeSave: false});

    return next(new AppError("There was an error sending the email. Try again later!", 500));
  }
});

module.exports = {signUp, login, forgotPassword};
