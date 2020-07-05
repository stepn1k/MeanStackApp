const multer = require("multer");

const MIME_TYPE_MAP = {
  'image/png': 'png',
  "image/jpeg": "jpg",
  "image/jpg": "jpg"
};

// https://metanit.com/web/nodejs/10.2.php
const storageConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    // check mime type
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error('Invalid mime type');

    if (isValid) error = null;

    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    // create file name
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + ext);
  }
});

module.exports = storageConfig;
