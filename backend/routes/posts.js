const express = require('express');
const Post = require("../models/post");
const multer = require("multer");
const storageConfig = require("./image-storage-congif");
const router = express.Router();

// ---- DELETE ---- //

router.delete("/:id", (req, res) => {
  Post.deleteOne({_id: req.params.id}).then(
    () => res.status(200).json({message: "Success"})
  );
});

// ---- GET All ---- //

router.get("", (req, res) => {
  Post.find().then(posts => {
      res.status(200).json({
        message: "Success",
        posts: posts
      });
    }
  ).catch(err => console.log(err));
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

    // post for Save
    const post = new Post({title, content, imagePath});

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

    const updatedPost = new Post({_id, title, content, imagePath});
    Post.updateOne({_id}, updatedPost).then(
      () => {
        res.status(200).json({message: "Update successful", updatedPost})
      }
    ).catch(err => console.log(err));
  });

module.exports = router;
