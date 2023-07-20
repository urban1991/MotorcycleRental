const auth = require('../middleware/auth');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const { User, validate } = require('../models/user');
const express = require('express');
const router = express.Router();
const Transaction = require('mongoose-transactions');
const transaction = new Transaction();

router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user._id).select('-password -_id');
  res.send(user);
});

router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send('User with given email address  already exist');

  user = new User(_.pick(req.body, ['firstName', 'lastName', 'email', 'password']));
  try {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    transaction.insert('User', user);
    await transaction.run();

    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send(_.pick(user, ['firstName', 'lastName', 'email']));
  } catch (ex) {
    res.status(500).send(ex);
  }
});

module.exports = router;
