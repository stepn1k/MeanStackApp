const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    // "Bearer token"
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, "long_secret_key");
    req.userData = {email: decodedToken.email, userId: decodedToken.userId};
    next()
  } catch {
    res.status(401).json({
      message: "Auth failed!"
    })
  }
};
