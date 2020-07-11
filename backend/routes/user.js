const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

router.post("/signup", (req, res) => {
  bcrypt.hash(req.body.password, 10).then(
    hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      });
      user.save().then(
        result => {
          res.status(201).json({
            message: "User created!",
            result
          })
        }
      ).catch(err => {
        res.status(400).json({
          message: "User Creation Error"
        })
      })
    }
  )
});

router.post("/login", (req, res) => {
  const {email, password} = req.body;
  let fetchedUsed;

  User.findOne({email}).then(
    user => {
      if (!user) {
        res.status(401).json({message: "User doesn't exist"})
      } else {
        fetchedUsed = user;
        return bcrypt.compare(password, user.password)
      }
    }
  ).then(compareResult => {
    if (!compareResult) {
      res.status(401).json({message: "Auth Failed"})
    }
    // init token
    const token = jwt.sign(
      {email, userId: fetchedUsed._id},
      "long_secret_key",
      {expiresIn: '1h'}
    );
    res.status(200).json({
      token,
      expiresIn: 3600000 // 1h
    })
  }).catch(err => res.status(401).json({message: "Auth Failed"}))
});


module.exports = router;
