const express = require("express");
const {
  getAllMotorcycles,
  createMotorcycle,
  getMotorcycle,
  updateMotorcycle,
  deleteMotorcycle,
} = require("../controllers/motorcycle");

const router = express.Router();

router.route("/")
  .get(getAllMotorcycles)
  .post(createMotorcycle);

router.route("/:id")
  .get(getMotorcycle)
  .patch(updateMotorcycle)
  .delete(deleteMotorcycle);

module.exports = router;
