const {validate, User} = require("../models/user");
const APIFeatures = require("../utils/apiFeatures");
const {updateObjFields} = require("../utils/updateObjFields");
const {tryCatchFn} = require("../utils/tryCatchFn");
const AppError = require("../utils/AppError");

function excludeReqFields(reqBody, ...excludedFields) {
  return Object.keys(reqBody).reduce((acc, curr) => {
    if (!excludedFields.includes(curr)) {
      acc[curr] = reqBody[curr];
    }
    return acc;
  }, {});
}

const getAllUsers = tryCatchFn(async (req, res) => {
  const features = new APIFeatures(User.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const users = await features.query;

  res.send(users);
});

const getUser = tryCatchFn(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).send("The user with given ID was not found");
  }

  res.send(user);
});

const updateLoggedUser = tryCatchFn(async (req, res, next) => {
  if (req.body.password || req.body.confirmPassword) {
    return next(
      new AppError("To update password use /updatePassword route", 400)
    );
  }

  const excludeFields = [
    "role",
    "isAdmin",
    "createdAt",
    "isVerified",
    "passwordResetToken",
    "passwordChangeTimestamp",
    "passwordResetTokenExpirationDate",
  ];

  const filterObj = excludeReqFields(req.body, ...excludeFields);

  const updatedFields = updateObjFields(filterObj);

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {$set: updatedFields},
    {new: true, runValidators: true}
  );

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});

const deleteMyAccount = tryCatchFn(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, {active: false});

  res.status(204).json({
    status: "success",
    data: null,
  });
});

// TODO: this one also need to be check if it's still in use, uninstall loadash
//  so this code is for sure to change
// async function createUser(req, res) {
//   const {error} = validate(req.body, "post");
//
//   if (error) {
//     return res.status(400).send(error.details[0].message);
//   }
//
//   let user = await User.findOne({email: req.body.email});
//   if (user) {
//     return res.status(400).send("User with given email address  already exist");
//   }
//
//   user = {};
//
//   try {
//     const salt = await bcrypt.genSalt(10);
//
//     user.password = await bcrypt.hash(user.password, salt);
//
//     //TODO drop transactions package and use mongoose transactions
//
//     // transaction.insert("User", user);
//     // await transaction.run();
//
//     const token = user.generateAuthToken();
//     res
//       .header("x-auth-token", token)
//   } catch (ex) {
//     res.status(500).send(ex);
//   }
// }

const updateUser = tryCatchFn(async (req, res) => {
  const {error} = validate(req.body, "patch");

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const updatedFields = updateObjFields(req.body);

  const user = await User.findByIdAndUpdate(
    req.params.id,
    {$set: updatedFields},
    {new: true}
  );

  if (!user) {
    return res.status(404).send("The user with given ID was not found");
  }

  res.send(user);
});

const deleteUser = tryCatchFn(async (req, res) => {
  const user = await User.findByIdAndRemove(req.params.id);

  if (!user) {
    return res.status(404).send("The user with the given ID was not found");
  }

  res.send(user);
});

module.exports = {
  getAllUsers,
  getUser,
  updateLoggedUser,
  updateUser,
  deleteUser,
  deleteMyAccount,
};
