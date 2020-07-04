const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Post = require("./models/post");

const app = express();

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

app.post("/api/posts", (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });
  post.save().then(
    (resData) => {
      const id = resData._id;
      res.status(201).json({
        message: "Post Added Successfully",
        postId: id
      })
      ;
    }
  )
});

app.get("/api/posts", (req, res, next) => {
  Post.find().then(
    documents => {
      res.status(200).json({
        message: "Success",
        posts: documents
      });
    }
  ).catch(err => console.log(err));
});

app.get('/api/posts/:id', (req, res, next) => {
  Post.findById(req.params.id).then(
    post => {
      if (post) {
        res.status(200).json(post)
      } else {
        return res.status(404).json({message: "Post not found!"})
      }
    }
  )
});

app.put("/api/posts/:id", (req, res, next) => {
  const post = new Post({
    _id: req.body._id,
    title: req.body.title,
    content: req.body.content
  });

  Post.updateOne({_id: req.params.id}, post).then(
    () => {
      res.status(200).json({
        message: "Update successful"
      });
    }
  ).catch(err => console.log(err));
});

app.delete("/api/posts/:id", (req, res, next) => {
  Post.deleteOne({_id: req.params.id}).then(
    () => {
      res.status(200).json({message: "Success"})
    }
  );
});


module.exports = app;
