const mongoose = require("mongoose");
// const jwt = require("jsonwebtoken");
const Joi = require("joi");
const bcrypt = require("bcrypt");

const {Schema} = mongoose;

const userSchema = new Schema({
  firstName: {
    type: String,
    minlength: 3,
    maxlength: 50,
    required: true,
  },
  lastName: {
    type: String,
    minlength: 2,
    maxlength: 50,
    required: true,
  },
  email: {
    type: String,
    minlength: 5,
    maxlength: 255,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    minlength: 5,
    maxlength: 1024,
    select: false,
    required: true,
  },
  confirmPassword: {
    type: String,
    minlength: 5,
    maxlength: 1024,
    required: true,
  },
  driverLicenseNumber: {
    type: String,
    unique: true,
    required: true,
  },
  phoneNumber: {
    type: String,
    minlength: 10,
    maxlength: 15,
    required: false,
  },
  dateOfBirth: {
    type: Date,
    required: false,
  },
  address: {
    type: String,
    minlength: 5,
    maxlength: 255,
    required: false,
  },
  avatarUrl: {
    type: String,
    required: false,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  isAdmin: Boolean,
});

userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) {
    return next();
  }
  // Hash the password with cost of 12 only if it has been modified or is new
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});

// userSchema.methods.generateAuthToken = function () {
//   const token = jwt.sign(
//     {_id: this._id, isAdmin: this.isAdmin},
//     // config.get("jwtPrivateKey"),
//   );
//   return token;
// };

const User = mongoose.model("User", userSchema);

function validateUser(user, requestType) {
  const userValidationSchema = Joi.object({
    firstName: Joi.string()
      .min(3)
      .max(50)
      .alter({patch: (schema) => schema.optional()}),
    lastName: Joi.string()
      .min(2)
      .max(50)
      .alter({patch: (schema) => schema.optional()}),
    email: Joi.string()
      .min(5)
      .max(255)
      .email()
      .alter({patch: (schema) => schema.optional()}),
    password: Joi.string()
      .min(5)
      .max(1024)
      .alter({patch: (schema) => schema.optional()}),
    confirmPassword: Joi.ref("password"),
    phoneNumber: Joi.string().min(10).max(15),
    dateOfBirth: Joi.date(),
    address: Joi.string().min(5).max(255),
    driverLicenseNumber: Joi.string().alter({
      patch: (schema) => schema.optional(),
    }),
    avatarUrl: Joi.string().uri().allow(""),
    isVerified: Joi.boolean(),
  });

  return userValidationSchema.tailor(requestType).validate(user);
}

exports.User = User;
exports.validate = validateUser;
