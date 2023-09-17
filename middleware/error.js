const winston = require("winston");
require("winston-mongodb");

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.prettyPrint(),
      ),
    }),
    new winston.transports.File({filename: "logfile.log"}),
  ],
  exceptionHandlers: [
    new winston.transports.File({
      filename: "exceptions.log",
      handleExceptions: true,
    }),
  ],
});


module.exports = function (err, req, res) {
  logger.error(err.message, {meta: err});
  res.status(500).send("Something failed terribly.");
};

module.exports.logger = logger;
