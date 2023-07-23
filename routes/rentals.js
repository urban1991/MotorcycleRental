const express = require("express");
const auth = require("../middleware/auth");
const {getAllRentals, getRental, createRental} = require("../controllers/rental");

const router = express.Router();

router.route("/")
  .get(getAllRentals)
  .post(auth, createRental);


router.route("/:id")
  .get(getRental);

module.exports = router;
