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
  res.send({ msg: "working" });
});

// @route   POST api/register/local
// @desc    Creating a new user locally
// @access  Public
router.post("/local", userValidationRules(), validateUser, async (req, res) => {
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

  const resMSG = {};

  bcrypt.hash(newUser.password, 10, (err, hash) => {
    if (err) throw err;
    newUser.password = hash;
    newUser
      .save()
      .then(async user => {
        resMSG.user = user;

        const emailSent = await sendConfirmationEmail(newUser);
        resMSG.emailSent = emailSent;

        res.send(resMSG);
      })
      .catch(err => console.log(err));
  });
});

// @route   POST api/register/confirmation
// @desc    Confirm newly created user
// @access  Public
router.post("/confirmation", (req, res) => {
  const token = req.body.token;
  User.findOneAndUpdate(
    { confirmationJWT: token },
    { confirmationJWT: "", confirmed: true },
    { new: true }
  )
    .then(user => {
      if (user) {
        return res.json({ confirmation: "Success" });
      }
      const errorObj = {};
      errorObj.confirmation = "Token is invalid";
      return res.status(400).send(errorObj);
    })
    .catch(err => console.log(err));
});

module.exports = router;
