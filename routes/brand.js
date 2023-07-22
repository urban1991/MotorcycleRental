const express = require("express");
const validateObjectId = require("../middleware/validateObjectId");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const {
  createBrand,
  getAllBrands,
  getBrand,
  deleteBrand,
  updateBrand
} = require("../controllers/brand");

const router = express.Router();

router.route("/")
  .get(getAllBrands)
  .post(createBrand);

router.route("/:id")
  .get(validateObjectId, getBrand)
  .patch([auth, validateObjectId], updateBrand)
  .delete([auth, admin, validateObjectId], deleteBrand);

module.exports = router;
