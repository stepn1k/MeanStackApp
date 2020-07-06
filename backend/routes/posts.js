const express = require('express');
const Post = require("../models/post");
const multer = require("multer");
const storageConfig = require("./image-storage-congif");
const router = express.Router();
const moment = require('moment');

// ---- DELETE ---- //

router.delete("/:id", (req, res) => {
  Post.deleteOne({_id: req.params.id}).then(
    () => res.status(200).json({message: "Success"})
  );
});

// ---- GET All ---- //

router.get("", (req, res) => {
  // query params
  let pageSize = +req.query.size;
  let page = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  if (pageSize && page) {
    postQuery
      .skip(pageSize * (page - 1))
      .limit(pageSize)
  }

  postQuery.then(posts => {
      fetchedPosts = posts;
      return Post.countDocuments()
    }
  ).then(count => {
      res.status(200).json({
        message: "Success",
        posts: fetchedPosts,
        count
      });
    }
  );
});

// ---- GET One---- //

router.get('/:id', (req, res) => {
  Post.findById(req.params.id).then(
    post => {
      if (post) {
        res.status(200).json(post)
      } else {
        res.status(404).json({message: "Post not found!"})
      }
    }
  )
});

// ---- POST ---- //

router.post("",
  // get image from input FormData and uploaded to storage
  multer({storage: storageConfig}).single("image"),
  (req, res) => {
    const url = req.protocol + "://" + req.get("host");
    // http://localhost:3000/images/example
    const imagePath = url + "/images/" + req.file.filename;
    const {title, content} = req.body;
    const updatedDate = moment().format('MMMM Do YYYY, h:mm:ss a');
    // post for Save
    const post = new Post({title, content, imagePath, updatedDate});
    post.save().then(
      savedPost => {
        res.status(201).json({
          message: "Post Added Successfully",
          post: savedPost
        });
      })
  });


// ---- PUT ---- //

router.put("/:id",
  multer({storage: storageConfig}).single("image"),
  (req, res) => {
    let {imagePath, _id, title, content} = req.body;
    // if image was updated
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/images/" + req.file.filename;
    }
    const updatedDate = moment().format('MMMM Do YYYY, h:mm:ss a');
    const updatedPost = new Post({_id, title, content, imagePath, updatedDate});

    Post.updateOne({_id}, updatedPost).then(
      () => {
        res.status(200).json({message: "Update successful", updatedPost})
      }
    ).catch(err => console.log(err));
  });

module.exports = router;
