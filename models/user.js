const mongoose = require("mongoose");
// const jwt = require("jsonwebtoken");
const Joi = require("joi");

const {Schema} = mongoose;

const userSchema = new Schema({
  firstName: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  lastName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    maxlength: 255,
  },
  password: {
    type: String,
    minlength: 5,
    maxlength: 1024,
    required: true,
    select: false,
  },
  phoneNumber: {
    type: String,
    required: false,
    minlength: 10,
    maxlength: 15,
  },
  dateOfBirth: {
    type: Date,
    required: false
  },
  address: {
    type: String,
    required: false,
    minlength: 5,
    maxlength: 255,
  },
  avatarUrl: {
    type: String,
    required: false
  },
  driverLicenseNumber: {
    type: String,
    required: true,
    unique: true,
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  isAdmin: Boolean,
});

// userSchema.methods.generateAuthToken = function () {
//   const token = jwt.sign(
//     {_id: this._id, isAdmin: this.isAdmin},
//     // config.get("jwtPrivateKey"),
//   );
//   return token;
// };

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = Joi.object({
    firstName: Joi.string().min(3).max(50).required(),
    lastName: Joi.string().min(2).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(1024).required(),
    phoneNumber: Joi.string().min(10).max(15),
    dateOfBirth: Joi.date(),
    address: Joi.string().min(5).max(255),
    driverLicenseNumber: Joi.string().required(),
    avatarUrl: Joi.string().uri().allow(''),
    isVerified: Joi.boolean(),
  });

  return schema.validate(user);
}

exports.User = User;
exports.validate = validateUser;
