const mongoose = require("mongoose");

const {Schema} = mongoose;
const Joi = require("joi");

const brandSchema = new Schema({
  brand: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  }
});

const Brand = mongoose.model("Brand", brandSchema);

function validateBrand(brand) {
  const schema = Joi.object({
    brand: Joi.string().min(3).max(50).required(),
  });

  return schema.validate(brand);
}

exports.brandSchema = brandSchema;
exports.Brand = Brand;
exports.validate = validateBrand;
