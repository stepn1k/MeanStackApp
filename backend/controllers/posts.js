const storageCleaner = require("../storage/cleaner");
const Post = require("../models/post");
const moment = require('moment');

exports.deletePost = (req, res) => {
  let postForStorageDeletion;
  Post.findById(req.params.id).then(
    post => {
      postForStorageDeletion = post;
      // delete post document
      Post.deleteOne({_id: req.params.id, creator: req.userData.userId}).then(
        (result) => {
          if (result.n) {
            //delete file
            storageCleaner(post);
            res.status(200).json({message: "Deletion successful"})
          } else {
            res.status(400).json({message: "You don't have access to this post!"})
          }
        });
    }
  );
};

exports.createPost = (req, res) => {
  const url = req.protocol + "://" + req.get("host");
  // http://localhost:3000/images/example
  const imagePath = url + "/images/" + req.file.filename;
  const {title, content} = req.body;
  const updatedDate = moment().format('MMMM Do YYYY, h:mm:ss a');
  // post for Save
  const post = new Post({
    title,
    content,
    imagePath,
    updatedDate,
    creator: req.userData.userId
  });
  post.save().then(
    savedPost => {
      res.status(201).json({
        message: "Post Added Successfully",
        post: savedPost
      });
    })
};


exports.updatePost = (req, res) => {
  let {imagePath, _id, title, content} = req.body;
  // if image was updated
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    imagePath = url + "/images/" + req.file.filename;
  }
  const updatedDate = moment().format('MMMM Do YYYY, h:mm:ss a');
  const updatedPost = new Post({_id, title, content, imagePath, updatedDate, creator: req.userData.userId});

  Post.updateOne({_id, creator: req.userData.userId}, updatedPost).then(
    (result) => {
      if (result.nModified) {
        res.status(200).json({message: "Update successful", updatedPost})
      } else {
        res.status(400).json({message: "You don't have access to this post!"})
      }
    }
  ).catch(err => {
    res.status(401).json({
      message: "Couldn't update post!"
    })
  })
};

exports.getAllPosts = (req, res) => {
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
  ).catch(err => res.status(400).json({
    message: "Fetching posts failed!"
  }));
};

exports.getPost = (req, res) => {
  Post.findById(req.params.id).then(
    post => {
      if (post) {
        res.status(200).json(post)
      } else {
        res.status(404).json({message: "Post not found!"})
      }
    }
  ).catch(err => res.status(400).json({
    message: "Fetching post failed!"
  }))
};
