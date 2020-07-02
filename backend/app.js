const express = require('express');

const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PATCH,DELETE,OPTIONS"
  );
  next()
});

app.use("/api/posts", (req, res, next) => {
  const posts = [
    {
      id: "8deba93842fc",
      title: 'John Keats',
      content: 'I love you the more in that I believe you had liked me for my own sake and for nothing else.'
    },
    {
      id: "0f63230b6179",
      title: 'Amelia Earhart',
      content: 'IThe most difficult thing is the decision to act, the rest is merely tenacity. The fears are paper tigers. You can do anything you decide to do. You can act to change and control your life; and the procedure, the process is its own reward.'
    },
    {
      id: "5aabab3d5123",
      title: 'Henry James',
      content: 'Do not mind anything that anyone tells you about anyone else. Judge everyone and everything for yourself.'
    },
    {
      id: "4eb13f9f4d55",
      title: 'Plato',
      content: 'Wise men speak because they have something to say; Fools because they have to say something.'
    },
    {
      id: "687168fa8ada",
      title: 'Thomas Paine',
      content: 'The World is my country, all mankind are my brethren, and to do good is my religion.'
    },
  ];

  res.status(200).json({
    message: "Success",
    posts: posts
  });

  next();
});

module.exports = app;
