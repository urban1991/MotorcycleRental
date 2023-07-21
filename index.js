require("./middleware/logger");
const winston = require("winston");
const express = require("express");
const {logger} = require("./middleware/error");

const app = express();

require("./startup/logging")();
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();
require("./startup/validation")();
require("./startup/prod")(app);

const port = process.env.PORT || 4000;
const server = app.listen(port, () =>
  logger.info(`listening on port ${port}...`),
);

module.exports = server;
