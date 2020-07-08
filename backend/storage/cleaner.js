const fs = require('fs');

const fileCleaner = (post) => {
  // TODO: error handler and issue with special characters in filename
  const imgRegExp = /images\/[\w-,!]*.(jpg|jpeg|png)$/gm;
  const imagePath = "backend/" + post.imagePath.match(imgRegExp)[0];
  fs.unlink(imagePath, (err) => {
    if (err) {
      console.error(err);
      return
    }
  })
};

module.exports = fileCleaner;
