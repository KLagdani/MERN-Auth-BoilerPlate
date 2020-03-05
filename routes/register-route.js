require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user-model");
const express = require("express");
const router = express.Router();
const {
  userValidationRules,
  validateUser
} = require("../validators/user-validator");
const {
  sendConfirmationEmail,
  sendResetPasswordLink
} = require("../utils/mailer/mailer");

// @route   POST api/register/test
// @desc    Testing route
// @access  Public
router.get("/test", (req, res) => {
  res.send("working");
});

// @route   POST api/register/local
// @desc    Creating a new user locally
// @access  Public
router.post("/local", userValidationRules(), validateUser, (req, res) => {
  const { username, email, password } = req.body;

  const confirmationJWT = jwt.sign(
    { username, email, confirmed: false },
    process.env.JWT_SECRET
  );

  const newUser = new User({
    username,
    email,
    password,
    confirmationJWT
  });

  bcrypt.hash(newUser.password, 10, (err, hash) => {
    if (err) throw err;
    newUser.password = hash;
    newUser
      .save()
      .then(user => {
        res.send(user);
      })
      .catch(err => console.log(err));
  });

  sendConfirmationEmail(newUser);
});

module.exports = router;
