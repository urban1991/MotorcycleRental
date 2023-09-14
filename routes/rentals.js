const express = require("express");
const {
  getAllRentals,
  getRental,
  createRental,
} = require("../controllers/rental");

const router = express.Router();

router
  .route("/")
  .get(getAllRentals)
  //TODO: add authentication middleware when it's ready
  .post(createRental);

router.route("/:id").get(getRental);

module.exports = router;
