const mongoose = require("mongoose");
const express = require("express");
const {Customer, validate} = require("../models/guest");

//TODO: this whole file requires refactoring
const router = express.Router();

router.get("/", async (req, res) => {
  const customers = await Customer.find().sort("name");
  res.send(customers);
});

router.get("/:id", async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer)
    return res.status(404).send("The motorcycle with given ID was not found");
  res.send(customer);
});

router.post("/", async (req, res) => {
  const {error} = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = new Customer({
    name: req.body.name,
    phone: req.body.phone,
    isVip: req.body.isVip,
  });

  await customer.save();
  res.send(customer);
});

router.put("/:id", async (req, res) => {
  const {error} = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        name: req.body.name,
        phone: req.body.phone,
        isVip: req.body.isVip,
      },
    },
    {returnOriginal: false}
  );
  if (!customer)
    return res.status(404).send("The motorcycle with given ID was not found");
  res.send(customer);
});

router.delete("/:id", async (req, res) => {
  const customer = await Customer.findByIdAndRemove(req.params.id);
  if (!customer)
    return res.status(404).send("The motorcycle with given ID was not found");

  res.send(customer);
});

module.exports = router;
