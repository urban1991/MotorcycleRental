const express = require("express");
const {createUser, getUser} = require("../controllers/user");

const router = express.Router();

router.route("/me").get(getUser)

router.route("/").post(createUser)

module.exports = router;
