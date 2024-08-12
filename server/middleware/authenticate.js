// server/middleware/authenticate.js

const authenticate = (req, res, next) => {
  if (req.session.userId) {
    return next();
  } else {
    return res.status(401).json({ error: "Access denied" });
  }
};

module.exports = authenticate;
