const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const postsRouter = require('./routes/posts');
const userRouter = require('./routes/user');

const app = express();

// connect to MongoDB
mongoose.connect(
  `mongodb+srv://Stepan:${process.env.MONGO_ATLAS_PW}@meanstack.lyoix.mongodb.net/node-angular?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  }
)
  .then(() => {
    console.log("Connected to DataBase!")
  })
  .catch((err) => {
    console.log(err);
    console.log("Connection Failed")
  });

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, authorization"
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
// allow to fetch files from images folder
app.use("/images", express.static(path.join("backend/images")));

app.use("/api/posts", postsRouter);
app.use("/api/user", userRouter);

module.exports = app;
