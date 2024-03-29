const {Brand, validate} = require("../models/brand");
const APIFeatures = require("../utils/apiFeatures");

async function getAllBrands(req, res) {
  const apiFeatures = new APIFeatures(Brand.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const brands = await apiFeatures.query;
  res.send(brands);
}

async function getBrand(req, res) {
  const brand = await Brand.findById(req.params.id);

  if (!brand) {
    return res.status(404).send("The brand with given ID was not found");
  }

  res.send(brand);
}

async function createBrand(req, res) {
  const {error} = validate(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  try {
    const brand = await Brand.create(req.body);
    res.send(brand);
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
}

async function updateBrand(req, res) {
  const {error} = validate(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const updatedFields = Object.entries(req.body).reduce(
    (acc, [key, value]) => ({
      ...acc,
      ...(value && {[key]: value}),
    }),
  );

  const brand = await Brand.findByIdAndUpdate(
    req.params.id,
    {$set: {updatedFields}},
    {new: true},
  );

  if (!brand) {
    return res.status(404).send("The brand with given ID was not found");
  }

  res.send(brand);
}

async function deleteBrand(req, res) {
  const brand = await Brand.findByIdAndRemove(req.params.id);

  if (!brand) {
    return res.status(404).send("The brand with given ID was not found");
  }

  res.send(brand);
}

module.exports = {
  getAllBrands,
  getBrand,
  createBrand,
  updateBrand,
  deleteBrand,
};
