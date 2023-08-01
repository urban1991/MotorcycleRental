const {brandSchema} = require("./brand");
const mongoose = require("mongoose");

const {Schema} = mongoose;
const Joi = require("joi");

const motorcycleSchema = new Schema({
  brand: {
    type: brandSchema,
    required: false
  },
  model: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 150
  },
  bodyType: {
    type: String,
    required: true,
    enum: ["sport", "enduro", "tourist", "chopper"]
  },
  motor: {
    type: Number,
    min: 49,
    max: 3000
  },
  year: {
    type: Number,
    minlength: 4,
    maxlength: 4
  },
  imageUrl: {
    type: String,
    required: false
  },
  dailyRentalFee: {
    type: Number,
    required: true,
    min: 0,
    max: 3000
  },
  numberInStock: {
    type: Number,
    required: true,
    min: 0,
    max: 15
  },
  mileage: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  VIN: {
    type: String,
    required: true,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

const Motorcycle = mongoose.model("Motorcycle", motorcycleSchema);

function validateMotorcycle(motorcycle, requestType) {
  const schema = Joi.object({
    brandId: Joi.string().required(),
    model: Joi.string().min(3).max(150).alter({patch: schema => schema.optional()}),
    bodyType: Joi.string().valid("sport", "enduro", "tourist", "chopper").required().alter({patch: schema => schema.optional()}),
    motor: Joi.number().min(49).max(3000).required().alter({patch: schema => schema.optional()}),
    year: Joi.number().integer().min(1885).max(new Date().getFullYear()).required().alter({patch: schema => schema.optional()}),
    imageUrl: Joi.string().uri().allow(""),
    dailyRentalFee: Joi.number().min(0).max(3000).required().alter({patch: schema => schema.optional()}),
    numberInStock: Joi.number().min(0).max(15).required().alter({patch: schema => schema.optional()}),
    mileage: Joi.number().required().alter({patch: schema => schema.optional()}),
    description: Joi.string().allow(""),
    VIN: Joi.string().required().alter({patch: schema => schema.optional()}),
    createdAt: Joi.date()
  });


  return schema.tailor(requestType).validate(motorcycle);
}

exports.Motorcycle = Motorcycle;
exports.validate = validateMotorcycle;
