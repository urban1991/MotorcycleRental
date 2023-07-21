const winston = require("winston");
require("winston-mongodb");

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({filename: "logfile.log"}),

    // new winston.transports.MongoDB(
    //     {
    //         db: 'mongodb://localhost/motoRental',
    //         level: 'info',
    //         options: {
    //             useUnifiedTopology: true
    //         },
    //         metaKey: 'meta',
    //         storeHost: true,
    //     })
  ],
  exceptionHandlers: [
    new winston.transports.File({
      filename: "exceptions.log",
      handleExceptions: true,
    }),
  ],
});

module.exports = function (err, req, res, next) {
  logger.error(err.message, {meta: err});
  logger.transports.Console({colorize: true, prettyPrint: true});
  logger.exceptions.handle(new transports.File({filename: "exceptions.log"}));

  res.status(500).send("Something failed terribly.");
};

module.exports.logger = logger;
