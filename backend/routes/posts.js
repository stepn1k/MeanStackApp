const express = require('express');
const Post = require("../models/post");
const router = express.Router();

router.post("", (req, res, next) => {
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

router.get("", (req, res, next) => {
  Post.find().then(
    documents => {
      res.status(200).json({
        message: "Success",
        posts: documents
      });
    }
  ).catch(err => console.log(err));
});

router.get('/:id', (req, res, next) => {
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

router.put("/:id", (req, res, next) => {
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

router.delete("/:id", (req, res, next) => {
  Post.deleteOne({_id: req.params.id}).then(
    () => {
      res.status(200).json({message: "Success"})
    }
  );
});

module.exports = router;
