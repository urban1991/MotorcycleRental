const {Rental, validate} = require("../models/rental");
const {Customer} = require("../models/customer");
const {Motorcycle} = require("../models/motorcycle");

const APIFeatures = require("../utils/apiFeatures");

async function getAllRentals(req, res) {
  const apiFeatures = new APIFeatures(Rental.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const rentals = await apiFeatures.query;
  res.send(rentals);
}

async function getRental(req, res) {
  const rental = await Rental.findById(req.params.id);
  if (!rental) {
    return res.status(404).send("The rental with the given ID was not found");
  }

  res.send(rental);
}

async function createRental(req, res) {
  const { error } = validate(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) {
    return res.status(400).send("Invalid customer.");
  }

  const motorcycle = await Motorcycle.findById(req.body.motorcycleId);
  if (!motorcycle) {
    return res.status(400).send("Invalid motorcycle.");
  }

  if (motorcycle.numberInStock === 0) {
    return res.status(400).send("Motorcycle not in stock.");
  }

  const rental = await Rental.create(req.body);

  //TODO: drop mongoose-transactions package and use mongoose transactions

  // try {
  //   const transaction = new Transaction();
  //   const rentalId = transaction.insert("Rental", rental);
  //   transaction.update("Motorcycle", motorcycle._id, {
  //     $inc: {
  //       numberInStock: -1,
  //     },
  //   });
  //
  //   await transaction.run();
  //
  //   res.send(rental);
  // } catch (ex) {
  //   res.status(500).send("Something failed.");
  // }
}

module.exports = {
  getAllRentals,
  getRental,
  createRental
}
