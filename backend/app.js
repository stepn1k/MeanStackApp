const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const postsRouter = require('./routes/posts');

const app = express();

// connect to MongoDB
mongoose.connect(
  "mongodb+srv://Stepan:kCv05LguSRoVZsIW@meanstack.lyoix.mongodb.net/node-angular?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
)
  .then(() => {
    console.log("Connected to DataBase!")
  })
  .catch(() => {
    console.log("Connection Failed")
  });

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,OPTIONS"
  );
  next()
});

// parse application/json
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));

app.use("/api/posts", postsRouter);

module.exports = app;
