const {User} = require("../models/user");
const {tryCatchFn} = require("../utils/tryCatchFn");

const signUp = tryCatchFn(async (req, res) => {
  const newUser = await User.create(req.body);
  res.send(newUser);
});

module.exports = {signUp};
