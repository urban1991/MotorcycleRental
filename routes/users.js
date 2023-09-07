const express = require("express");
const {
  getAllUsers,
  getLoggedUser,
  updateUser,
  deleteUser,
  createUser,
  getUser,
} = require("../controllers/user");
const {signUp} = require("../controllers/authentication");

const router = express.Router();

router.post("/signup", signUp);

router.route("/me").get(getLoggedUser);

router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

router.route("/").get(getAllUsers).post(createUser);

module.exports = router;
