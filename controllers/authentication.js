const jwt = require("jsonwebtoken");
const {User} = require("../models/user");
const {tryCatchFn} = require("../utils/tryCatchFn");
const AppError = require('./../utils/appError');

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
  })
});

module.exports = {signUp, login};
