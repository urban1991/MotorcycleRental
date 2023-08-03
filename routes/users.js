const express = require("express");
const {getAllUsers, createUser, getUser} = require("../controllers/user");

const router = express.Router();

router.route("/me").get(getUser);

router.route("/").get(getAllUsers).post(createUser);

module.exports = router;
