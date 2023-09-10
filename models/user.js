const mongoose = require("mongoose");
const crypto = require("crypto");
const Joi = require("joi");
const bcrypt = require("bcrypt");

const {Schema} = mongoose;

const userSchema = new Schema({
  firstName: {
    type: String,
    minlength: 3,
    maxlength: 50,
    required: true
  },
  lastName: {
    type: String,
    minlength: 2,
    maxlength: 50,
    required: true
  },
  email: {
    type: String,
    minlength: 5,
    maxlength: 255,
    unique: true,
    required: true
  },
  password: {
    type: String,
    minlength: 5,
    maxlength: 1024,
    select: false,
    required: true
  },
  confirmPassword: {
    type: String,
    minlength: 5,
    maxlength: 1024,
    required: true
  },
  role: {
    type: String,
    enum: ["user", "vip-user", "admin"],
    default: "user",
    required: true
  },
  passwordChangeTimestamp: Date,
  driverLicenseNumber: {
    type: String,
    unique: true,
    required: true
  },
  phoneNumber: {
    type: String,
    minlength: 10,
    maxlength: 15,
    required: false
  },
  dateOfBirth: {
    type: Date,
    required: false
  },
  address: {
    type: String,
    minlength: 5,
    maxlength: 255,
    required: false
  },
  avatarUrl: {
    type: String,
    required: false
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  isAdmin: Boolean,
  passwordResetToken: String,
  passwordResetTokenExpirationDate: Date
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

userSchema.methods.comparePasswords = async function(typedPassword, userPassword) {
  return await bcrypt.compare(typedPassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function(tokenTimestamp) {
  if (this.passwordChangeTimestamp) {
    const changedTimestamp = Math.floor(this.passwordChangeTimestamp.getTime() / 1000);
    return tokenTimestamp < changedTimestamp;
  }
  return false;
};

userSchema.methods.generatePasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  this.passwordResetTokenExpirationDate = new Date(new Date().getTime() + 10 * 60000);

  console.log(`resetToken: `, {resetToken, DatabaseToken: this.passwordResetToken});
  return resetToken;
};

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
      patch: (schema) => schema.optional()
    }),
    avatarUrl: Joi.string().uri().allow(""),
    isVerified: Joi.boolean()
  });

  return userValidationSchema.tailor(requestType).validate(user);
}

exports.User = User;
exports.validate = validateUser;
