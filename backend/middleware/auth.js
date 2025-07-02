// middleware/auth.js
const ensureAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ success: false, message: 'You must be logged in to perform this action.' });
};

module.exports = ensureAuth;
