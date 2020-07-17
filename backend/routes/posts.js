const express = require('express');
const multer = require("multer");
const storageConfig = require("../storage/congif");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");
const PostController = require("../controllers/posts");


router.delete("/:id", checkAuth, PostController.deletePost);

router.get("", PostController.getAllPosts);

router.get('/:id', PostController.getPost);

router.post("",
  checkAuth,
  // get image from input FormData and uploaded to storage
  multer({storage: storageConfig}).single("image"),
  PostController.createPost
);

router.put("/:id",
  checkAuth,
  multer({storage: storageConfig}).single("image"),
  PostController.updatePost
);

module.exports = router;
