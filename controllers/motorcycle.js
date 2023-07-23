const {Motorcycle, validate} = require("../models/motorcycle");
const {Brand} = require("../models/brand");


async function getAllMotorcycles(req, res) {
  const motorcycles = await Motorcycle.find().sort("brand");
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
  const {error} = validate(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const motoBrand = await Brand.findById(req.body.brandId);

  if (!motoBrand) {
    return res.status(400).send("Invalid brand");
  }

  const motorcycle = await Motorcycle.create({
    brand: {
      _id: motoBrand._id,
      brand: motoBrand.brand
    },
    model: req.body.model,
    bodyType: req.body.bodyType,
    motor: req.body.motor,
    year: req.body.year,
    dailyRentalFee: req.body.dailyRentalFee,
    numberInStock: req.body.numberInStock,
  });

  res.send(motorcycle);
}

async function updateMotorcycle(req, res) {
  const {error} = validate(req.body);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const motoBrand = await Brand.findById(req.body.brandId);

  if (!motoBrand) {
    return res.status(400).send("Invalid brand");
  }

  const motorcycle = await Motorcycle.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        brand: {
          _id: motoBrand._id,
          brand: motoBrand.brand,
        },
        model: req.body.model,
        bodyType: req.body.bodyType,
        motor: req.body.motor,
        year: req.body.year,
        dailyRentalFee: req.body.dailyRentalFee,
        numberInStock: req.body.numberInStock,
      },
    },
    {returnOriginal: false},
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
  getAllMotorcycles,
  getMotorcycle,
  createMotorcycle,
  updateMotorcycle,
  deleteMotorcycle
};
