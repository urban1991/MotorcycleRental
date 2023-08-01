const {Motorcycle, validate} = require("../models/motorcycle");
const {Brand} = require("../models/brand");
const APIFeatures = require("../utils/apiFeatures");


async function topMotorcycles(req, res) {
  const motorcycles = await Motorcycle.find()
    .limit(5)
    .sort("-dailyRentalFee")
    .select("model dailyRentalFee year brand");

  // not sure if this will work as expected, maybe need to call next()?
  res.send(motorcycles);
}

async function getAllMotorcycles(req, res) {
  const apiFeatures = new APIFeatures(Motorcycle.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const motorcycles = await apiFeatures.query;
  res.send(motorcycles);
}

async function getMotorcycle(req, res) {
  const motorcycle = await Motorcycle.findById(req.params.id);

  if (!motorcycle) {
    return res.status(404).send("The motorcycle with given ID was not found");
  }
  res.send(motorcycle);
}

async function createMotorcycle(req, res) {
  const {error} = validate(req.body, "post");

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const motoBrand = await Brand.findById(req.body.brandId);

  if (!motoBrand) {
    return res.status(400).send("Invalid brand");
  }

  try {
    const motorcycle = await Motorcycle.create(req.body);
    res.send(motorcycle);

  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error
    });
  }
}

async function updateMotorcycle(req, res) {
  const {error} = validate(req.body, "patch");

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const motoBrand = await Brand.findById(req.body.brandId);

  if (!motoBrand) {
    return res.status(400).send("Invalid brand");
  }

  const updatedFields = Object.entries(req.body).reduce((acc, [key, value]) => ({
    ...acc,
    ...(value && {[key]: value})
  }));

  const motorcycle = await Motorcycle.findByIdAndUpdate(
    req.params.id,
    {$set: updatedFields},
    {new: true}
  );

  if (!motorcycle) {
    return res.status(404).send("The motorcycle with given ID was not found");
  }

  res.send(motorcycle);
}

async function deleteMotorcycle(req, res) {
  const motorcycle = await Motorcycle.findByIdAndDelete(req.params.id);

  if (!motorcycle) {
    return res.status(404).send("The motorcycle with given ID was not found");
  }

  res.send(motorcycle);
}

module.exports = {
  topMotorcycles,
  getAllMotorcycles,
  getMotorcycle,
  createMotorcycle,
  updateMotorcycle,
  deleteMotorcycle
};
