const helmet = require("helmet");
const express = require("express");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const motorcycles = require("../routes/motorcycles");
const customers = require("../routes/guests");
const brands = require("../routes/brand");
const rentals = require("../routes/rentals");
const users = require("../routes/users");
const error = require("../middleware/error");

const limiter = rateLimit({
  max: 100,
  windowMs: 3600000,
  message: "Too many requests from this IP, please try again in an hour!",
});

module.exports = function (app) {
  app.use(helmet());
  app.use("/api", limiter);
  app.use(express.json());
  app.use(mongoSanitize());
  app.use("/api/motorcycles", motorcycles);
  app.use("/api/customers", customers);
  app.use("/api/brands", brands);
  app.use("/api/rentals", rentals);
  app.use("/api/users", users);
  app.use(error);
};
