const mongoose = require("mongoose");

const {Schema} = mongoose;
const Joi = require("joi");
const moment = require("moment");

rentalSchema = new Schema({
  customer: {
    type: new mongoose.Schema({
      name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
      },
      isVip: {
        type: Boolean,
        default: false,
      },
      phone: {
        type: String,
      },
    }),
    required: true,
  },
  motorcycle: {
    type: new mongoose.Schema({
      mark: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
      },
      model: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
      },
      dailyRentalFee: {
        type: Number,
        required: true,
        min: 10,
        max: 3000,
      },
    }),
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ["reserved", "rented", "returned", "late"],
  },
  paymentMethod: {
    type: new mongoose.Schema({
      cardType: {
        type: String,
        required: true,
        enum: ["Visa", "MasterCard", "AmericanExpress"],
      },
      cardNumber: {
        type: String,
        required: true,
        minlength: 16,
        maxlength: 16,
      },
      expiryDate: {
        type: Date,
        required: true,
      },
      CVV: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 4,
      },
    }),
    required: true,
  },
  lateFee: {
    type: Number,
    min: 0,
  },
  customerFeedback: {
    type: String,
    maxlength: 500,
  },
  dateOut: {
    type: Date,
    required: true,
    default: Date.now,
  },
  declaredReturnDate: {
    type: Date,
    required: true,
    validate: {
      // This refers to the current document and works only on create
      validator: function (value) {
        return value > this.dateOut;
      },
      message: (props) =>
        `The declared return date (${props.value}) must be later than the date out (${this.dateOut}).`,
    },
  },
  dateReturned: {
    type: Date,
  },
  rentalFee: {
    type: Number,
    min: 100,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

rentalSchema.statics.lookup = function (customerId, motorcycleId) {
  return this.findOne({
    "customer._id": customerId,
    "motorcycle._id": motorcycleId,
  });
};

rentalSchema.methods.return = function () {
  this.dateReturned = new Date();

  const rentalDays = moment().diff(this.dateOut, "days");
  this.rentalFee = rentalDays * this.motorcycle.dailyRentalFee;
};

const Rental = mongoose.model("Rental", rentalSchema);

function validateRental(rental) {
  const schema = Joi.object({
    customerId: Joi.string().alphanum().length(24).required(),
    motorcycleId: Joi.string().alphanum().length(24).required(),
    status: Joi.string()
      .valid("reserved", "rented", "returned", "late")
      .required(),
    paymentMethod: Joi.object({
      cardType: Joi.string()
        .valid("Visa", "MasterCard", "AmericanExpress")
        .required(),
      cardNumber: Joi.string().length(16).required(),
      expiryDate: Joi.date().required(),
      CVV: Joi.string().length(3).required(),
    }).required(),
    lateFee: Joi.number().min(0),
    declaredReturnDate: Joi.date().required(),
    customerFeedback: Joi.string().max(500),
  });

  return schema.validate(rental);
}

exports.Rental = Rental;
exports.validate = validateRental;
