const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.createUser = (req, res) => {
  bcrypt.hash(req.body.password, 10).then(
    // create user object
    hash => {
      const user = new User(
        {
          email: req.body.email,
          password: hash
        }
      );
      // save in mongoDB
      user.save().then(
        result => {
          res.status(201).json({
            message: "User created!",
            result
          })
        }
      ).catch(err => {
        res.status(400).json({
          message: "User Creation Error!"
        })
      })
    }
  )
};

exports.loginUser = (req, res) => {
  const {email, password} = req.body;
  let fetchedUsed;
// find user in Mongo
  User.findOne({email}).then(
    user => {
      if (!user) {
        res.status(401).json({message: "User doesn't exist"})
      } else {
        // save fetched user to use for generate jwt
        fetchedUsed = user;
        // compare Authorization Data
        return bcrypt.compare(password, user.password)
      }
    }
  ).then(compareResult => {
    if (!compareResult) {
      res.status(401).json({message: "Auth Failed! Your Authorization Data is incorrect!"})
    }
    // init token
    const token = jwt.sign(
      {email, userId: fetchedUsed._id},
      "long_secret_key",
      {expiresIn: '1h'}
    );
    //send response
    res.status(200).json({
      token,
      expiresIn: 3600000, // 1h
      userId: fetchedUsed._id
    })
  }).catch(err => {
    res.status(401)
      .json({message: "Auth Failed! Please try again later!"})
  })
};
