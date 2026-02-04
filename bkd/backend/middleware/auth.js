module.exports = (req, res, next) => {
  // Check if session has userId
  if (!req.session.userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // User is logged in → proceed to next middleware/route
  next();
};
