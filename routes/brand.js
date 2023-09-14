const express = require("express");
const validateObjectId = require("../middleware/validateObjectId");
// const auth = require("../middleware/auth");
// const admin = require("../middleware/admin");
const {
  createBrand,
  getAllBrands,
  getBrand,
  deleteBrand,
  updateBrand,
} = require("../controllers/brand");

const router = express.Router();

router.route("/").get(getAllBrands).post(createBrand);

router
  .route("/:id")
  .get(validateObjectId, getBrand)
  //TODO: add auth and admin middleware when you learn how to use them

  // .patch([auth, validateObjectId], updateBrand)
  // .delete([auth, admin, validateObjectId], deleteBrand);
  .patch(updateBrand)
  .delete(deleteBrand);

module.exports = router;
