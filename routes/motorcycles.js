const mongoose = require("mongoose");
const express = require("express");
const auth = require("../middleware/auth");
const {Motorcycle, validate} = require("../models/motorcycle");
const {Mark} = require("../models/mark");

const router = express.Router();

router.get("/", async (req, res) => {
  const motorcycles = await Motorcycle.find().sort("mark");
  res.send(motorcycles);
});

router.get("/:id", async (req, res) => {
  const motorcycle = await Motorcycle.findById(req.params.id);
  if (!motorcycle)
    return res.status(404).send("The motorcycle with given ID was not found");
  res.send(motorcycle);
});

router.post("/", auth, async (req, res) => {
  const {error} = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const mark = await Mark.findById(req.body.markId);
  if (!mark) return res.status(400).send("Invalid mark");

  const motorcycle = new Motorcycle({
    mark: {
      _id: mark._id,
      mark: mark.mark,
    },
    model: req.body.model,
    bodyType: req.body.bodyType,
    motor: req.body.motor,
    year: req.body.year,
    dailyRentalFee: req.body.dailyRentalFee,
    numberInStock: req.body.numberInStock,
  });

  await motorcycle.save();
  res.send(motorcycle);
});

router.put("/:id", auth, async (req, res) => {
  const {error} = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const mark = await Mark.findById(req.body.markId);
  if (!mark) return res.status(400).send("Invalid mark");

  const motorcycle = await Motorcycle.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        mark: {
          _id: mark._id,
          mark: mark.mark,
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
  if (!motorcycle)
    return res.status(404).send("The motorcycle with given ID was not found");
  res.send(motorcycle);
});

router.delete("/:id", auth, async (req, res) => {
  const motorcycle = await Motorcycle.findByIdAndRemove(req.params.id);
  if (!motorcycle)
    return res.status(404).send("The motorcycle with given ID was not found");

  res.send(motorcycle);
});

module.exports = router;
