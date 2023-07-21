const mongoose = require("mongoose");

const {Schema} = mongoose;
const Joi = require("@hapi/joi");
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
        min: 0,
        max: 3000,
      },
    }),
    required: true,
  },
  dateOut: {
    type: Date,
    required: true,
    default: Date.now,
  },
  dateReturned: {
    type: Date,
  },
  rentalFee: {
    type: Number,
    min: 100,
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
    customerId: Joi.objectId().required(),
    motorcycleId: Joi.objectId().required(),
  });

  return schema.validate(rental);
}

exports.Rental = Rental;
exports.validate = validateRental;
