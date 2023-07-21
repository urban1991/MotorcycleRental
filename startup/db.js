const mongoose = require("mongoose");
const winston = require("winston");
const config = require("config");

module.exports = function () {
  mongoose
    .connect(config.get("db"), {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    })
    .then(() => winston.info(`Connected to ${config.get("db")}..`));
};
