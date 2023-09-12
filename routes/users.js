const express = require("express");
const {
  getAllUsers,
  getLoggedUser,
  updateUser,
  deleteUser,
  createUser,
  getUser
} = require("../controllers/user");
const {
  signUp,
  login,
  forgotPassword,
  resetPassword,
  updatePassword
} = require("../controllers/authController");
const {isLoggedIn} = require("../middleware/isLoggedIn");
const {isAuthorized} = require("../middleware/isAuthorized");

const router = express.Router();

router.post("/signup", signUp);
router.post("/login", login);

router.post("/forgotPassword", forgotPassword);
router.patch("/resetPassword/:token", resetPassword);

router.patch("/updatePassword", isLoggedIn, updatePassword);


router.route("/me").get(getLoggedUser);

router.route("/:id")
  .get(getUser)
  .patch(updateUser)
  .delete(isLoggedIn, isAuthorized("admin"), deleteUser);

router.route("/")
  .get(isLoggedIn, getAllUsers)
  .post(createUser);

module.exports = router;
