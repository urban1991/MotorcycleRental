const {Brand, validate} = require("../models/brand");

async function getAllBrands(req, res) {
  const brands = await Brand.find().sort("brand");

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

  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error
    });
  }
}

async function updateBrand(req, res) {
  const {error} = validate(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const brand = await Brand.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        brand: req.body.brand
      }
    },
    {returnOriginal: false}
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
  deleteBrand
};
