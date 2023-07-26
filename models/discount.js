const mongoose = require("mongoose");
const {Schema} = mongoose;
const Joi = require("joi");

const discountSchema = new Schema({
  discountCode: {
    type: String,
    required: true,
    unique: true
  },
  description: String,
  discountAmount: {
    type: Number,
    required: true,
    min: 0
  },
  validFrom: {
    type: Date,
    default: Date.now()
  },
  validUntil: Date
});

const Discount = mongoose.model("Discount", discountSchema);

function validateDiscount(discount) {
  const schema = Joi.object({
    discountCode: Joi.string().required(),
    description: Joi.string(),
    discountAmount: Joi.number().min(0).required(),
    validFrom: Joi.date(),
    validUntil: Joi.date()
  });

  return schema.validate(discount);
}

exports.Discount = Discount;
exports.validate = validateDiscount;
