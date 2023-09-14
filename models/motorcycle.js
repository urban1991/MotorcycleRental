const {brandSchema} = require("./brand");
const mongoose = require("mongoose");

const {Schema} = mongoose;
const Joi = require("joi");

const motorcycleSchema = new Schema(
  {
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
      enum: {
        values: ["sport", "enduro", "tourist", "chopper"],
        message:
          "Invalid body type. Available types: sport, enduro, tourist, chopper",
      },
    },
    motor: {
      type: Number,
      min: [49, "A motorcycle must have at least 50cc"],
      max: 3000,
    },
    year: {
      type: Number,
      minlength: [4, "A year must have 4 digits"],
      maxlength: [4, "A year must have 4 digits"],
    },
    imageUrl: {
      type: String,
      required: false,
    },
    dailyRentalFee: {
      type: Number,
      required: true,
      min: [10, "A daily rental fee must be at least 10$"],
      max: [3000, "A daily rental fee cannot be more than 3000$"],
    },
    numberInStock: {
      type: Number,
      required: true,
      min: 0,
      max: 15,
    },
    mileage: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    VIN: {
      type: String,
      required: true,
      unique: true,
      min: [10, "A VIN must have at least 10 digits"],
      max: [10, "A VIN must have at least 10 digits"],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {toJSON: {virtuals: true}, toObject: {virtuals: true}},
);

//Just a demonstration of virtual property usage
motorcycleSchema.virtual("V-Max").get(function () {
  return this.motor && this.motor > 500 ? 240 : 180;
});

//DOCUMENT Middleware example previous to save
motorcycleSchema.pre("save", function (next) {
  console.log("Pre save middleware", this);
  next();
});

//DOCUMENT Middleware example post to save
motorcycleSchema.post("save", (doc, next) => {
  console.log("Post save middleware", doc);
  next();
});

const Motorcycle = mongoose.model("Motorcycle", motorcycleSchema);

function validateMotorcycle(motorcycle, requestType) {
  const schema = Joi.object({
    brandId: Joi.string().required(),
    model: Joi.string()
      .min(3)
      .max(150)
      .alter({patch: (schema) => schema.optional()}),
    bodyType: Joi.string()
      .valid("sport", "enduro", "tourist", "chopper")
      .required()
      .alter({patch: (schema) => schema.optional()}),
    motor: Joi.number()
      .min(49)
      .max(3000)
      .required()
      .alter({patch: (schema) => schema.optional()}),
    year: Joi.number()
      .integer()
      .min(1885)
      .max(new Date().getFullYear())
      .required()
      .alter({patch: (schema) => schema.optional()}),
    imageUrl: Joi.string().uri().allow(""),
    dailyRentalFee: Joi.number()
      .min(0)
      .max(3000)
      .required()
      .alter({patch: (schema) => schema.optional()}),
    numberInStock: Joi.number()
      .min(0)
      .max(15)
      .required()
      .alter({patch: (schema) => schema.optional()}),
    mileage: Joi.number()
      .required()
      .alter({patch: (schema) => schema.optional()}),
    description: Joi.string().allow(""),
    VIN: Joi.string()
      .required()
      .alter({patch: (schema) => schema.optional()}),
    createdAt: Joi.date(),
  });

  return schema.tailor(requestType).validate(motorcycle);
}

exports.Motorcycle = Motorcycle;
exports.validate = validateMotorcycle;
