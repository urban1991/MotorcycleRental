const mongoose = require("mongoose");

const {Schema} = mongoose;
const Joi = require("joi");

const brandSchema = new Schema({
  brand: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50
  },
  country: {
    type: String,
    required: false,
    minlength: 2,
    maxlength: 50
  },
  website: {
    type: String,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

const Brand = mongoose.model("Brand", brandSchema);

function validateBrand(brand) {
  const schema = Joi.object({
    brand: Joi.string().min(3).max(50).required(),
    country: Joi.string().min(2).max(50),
    website: Joi.string().uri()
  });

  return schema.validate(brand);
}

exports.brandSchema = brandSchema;
exports.Brand = Brand;
exports.validate = validateBrand;
