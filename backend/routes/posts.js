const express = require('express');
const extractFile = require("../storage/congif");
const router = express.Router();
const checkAuth = require("../middleware/check-auth");
const PostController = require("../controllers/posts");


router.delete("/:id", checkAuth, PostController.deletePost);

router.get("", PostController.getAllPosts);

router.get('/:id', PostController.getPost);

router.post("",
  checkAuth,
  extractFile,
  PostController.createPost
);

router.put("/:id",
  checkAuth,
  extractFile,
  PostController.updatePost
);

module.exports = router;
