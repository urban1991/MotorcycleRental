const express = require("express");
const motorcycles = require("../routes/motorcycles");
const customers = require("../routes/customers");
const marks = require("../routes/marks");
const rentals = require("../routes/rentals");
const users = require("../routes/users");
const auth = require("../routes/auth");
const error = require("../middleware/error");
const returns = require("../routes/returns");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api/motorcycles", motorcycles);
  app.use("/api/customers", customers);
  app.use("/api/marks", marks);
  app.use("/api/rentals", rentals);
  app.use("/api/users", users);
  app.use("/api/auth", auth);
  app.use("/api/returns", returns);
  app.use(error);
};
