const {brandSchema} = require("./brand");
const mongoose = require("mongoose");

const {Schema} = mongoose;
const Joi = require("@hapi/joi");

const motorcycleSchema = new Schema({
  brand: {
    type: brandSchema,
    required: false,
  },
  model: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 150,
  },
  bodyType: {
    type: String,
    required: true,
    enum: ["sport", "enduro", "tourist", "chopper"],
  },
  motor: {
    type: Number,
    min: 49,
    max: 3000,
  },
  year: {
    type: Number,
    minlength: 4,
    maxlength: 4,
  },
  dailyRentalFee: {
    type: Number,
    required: true,
    min: 0,
    max: 3000,
  },
  numberInStock: {
    type: Number,
    required: true,
    min: 0,
    max: 15,
  },
});

const Motorcycle = mongoose.model("Motorcycle", motorcycleSchema);

function validateMotorcycle(motorcycle) {
  const schema = Joi.object({
    brandId: Joi.objectId().required(),
    model: Joi.string().min(5).required(),
    bodyType: Joi.string(),
    motor: Joi.number(),
    year: Joi.number(),
    dailyRentalFee: Joi.number(),
    numberInStock: Joi.number(),
  });

  return schema.validate(motorcycle);
}

exports.Motorcycle = Motorcycle;
exports.validate = validateMotorcycle;
