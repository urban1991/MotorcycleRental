const mongoose = require("mongoose");

const {Schema} = mongoose;
const Joi = require("joi");

const paymentSchema = new Schema({
  customerId: {
    type: Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  rentalId: {
    type: Schema.Types.ObjectId,
    ref: "Rental",
    required: true,
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
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  paymentDate: {
    type: Date,
    default: Date.now(),
  },
});

const Payment = mongoose.model("Payment", paymentSchema);

function validatePayment(payment) {
  const schema = Joi.object({
    customerId: Joi.string().required(),
    rentalId: Joi.string().required(),
    amount: Joi.number().min(0).required(),
    paymentMethod: Joi.object({
      cardType: Joi.string()
        .valid("Visa", "MasterCard", "AmericanExpress")
        .required(),
      cardNumber: Joi.string().length(16).required(),
      expiryDate: Joi.date().required(),
      CVV: Joi.string().length(3).required(),
    }).required(),
  });

  return schema.validate(payment);
}

exports.Payment = Payment;
exports.validate = validatePayment;
