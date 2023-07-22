require("./middleware/logger");
const express = require("express");
const {logger} = require("./middleware/error");

const dotenv = require("dotenv");
dotenv.config({path: "./.env"})

const app = express();

require("./startup/logging")();
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/validation")();
require("./startup/prod")(app);

const port = process.env.PORT || 4000;

const server = app.listen(port, () =>
  logger.info(`listening on port ${port}...`),
);

module.exports = server;
