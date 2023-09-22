const mongoose = require("mongoose");

const {Schema} = mongoose;
const Joi = require("joi");

const guestSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: [3, "A customer name must be at least 3 characters long"],
    maxlength: [150, "A customer name cannot be longer than 150 characters"],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    maxlength: 255,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: false,
    minlength: 5,
    maxlength: 255,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  driverLicenseNumber: {
    type: String,
    required: true,
    unique: true,
  },
});

const Guest = mongoose.model("Customer", guestSchema);

function validateCustomer(guest) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(150).required(),
    email: Joi.string().min(5).max(255).required().email(),
    phone: Joi.string().required(),
    address: Joi.string().min(5).max(255),
    dateOfBirth: Joi.date(),
    driverLicenseNumber: Joi.string().required(),
  });

  return schema.validate(guest);
}

exports.Customer = Guest;
exports.validate = validateCustomer;
