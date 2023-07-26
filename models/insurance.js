const mongoose = require("mongoose");
const {Schema} = mongoose;
const Joi = require("joi");

const insuranceSchema = new Schema({
  insuranceProvider: {
    type: String,
    required: true
  },
  insurancePolicyNumber: {
    type: String,
    required: true,
    unique: true
  },
  insuranceStartDate: {
    type: Date,
    required: true
  },
  insuranceEndDate: Date
});

const Insurance = mongoose.model("Insurance", insuranceSchema);

function validateInsurance(insurance) {
  const schema = Joi.object({
    insuranceProvider: Joi.string().required(),
    insurancePolicyNumber: Joi.string().required(),
    insuranceStartDate: Joi.date().required(),
    insuranceEndDate: Joi.date()
  });

  return schema.validate(insurance);
}

exports.Insurance = Insurance;
exports.validate = validateInsurance;
