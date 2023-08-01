const express = require("express");
const {
  topMotorcycles,
  getAllMotorcycles,
  createMotorcycle,
  getMotorcycle,
  updateMotorcycle,
  deleteMotorcycle,
  getMotorcyclesStats
} = require("../controllers/motorcycle");

const router = express.Router();

router.route("/top").get(topMotorcycles);

router.route("/stats").get(getMotorcyclesStats);

router.route("/")
  .get(getAllMotorcycles)
  .post(createMotorcycle);

router.route("/:id")
  .get(getMotorcycle)
  .patch(updateMotorcycle)
  .delete(deleteMotorcycle);

module.exports = router;
