const mongoose = require("mongoose");

const db = process.env.DATABASE_URL;

module.exports = function () {
  mongoose
    .connect(db, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    })
    .then(() => {
      console.log("Connected to MongoDB...");
    })
    .catch((err) => {
      console.log("Could not connect to MongoDB...");
      console.log(err);
    });
};
