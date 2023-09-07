const {User} = require("../models/user");
const {tryCatchFn} = require("../utils/tryCatchFn");
const jwt = require("jsonwebtoken");

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

  const userToken = jwt.sign({id: newUser._id}, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });

  res.status(201).json({
    status: "success",
    token: userToken,
    data: {
      user: newUser
    }
  });
});

module.exports = {signUp};
