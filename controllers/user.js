const _ = require("lodash");
const bcrypt = require("bcrypt");
//Mongoose transactions needs to be replaced with something else
const Transaction = require("mongoose-transactions");
const {validate, User} = require("../models/user");
const APIFeatures = require("../utils/apiFeatures");

const transaction = new Transaction();

async function getAllUsers(req, res) {
  const features = new APIFeatures(User.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const users = await features.query;

  res.send(users);
}

async function createUser(req, res) {
  const {error} = validate(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  let user = await User.findOne({email: req.body.email});
  if (user) {
    return res.status(400).send("User with given email address  already exist");
  }

  user = new User(
    _.pick(req.body, ["firstName", "lastName", "email", "password"]),
  );

  try {
    const salt = await bcrypt.genSalt(10);

    user.password = await bcrypt.hash(user.password, salt);
    transaction.insert("User", user);

    await transaction.run();
    const token = user.generateAuthToken();
    res
      .header("x-auth-token", token)
      .send(_.pick(user, ["firstName", "lastName", "email"]));
  } catch (ex) {
    res.status(500).send(ex);
  }
}

async function getUser(req, res) {
  const user = await User.findById(req.user._id).select("-password -_id");

  res.send(user);
}

module.exports = {getAllUsers, getUser, createUser};
