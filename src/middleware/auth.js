const jwt = require("jsonwebtoken");
const env = require("../config/env");
const { getAuth } = require("firebase/auth");

/**
 * Middleware function to verify the authorization token.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Object} next - Express next middleware function.
 * @returns {Promise<void>}
 */
const verifyToken = (req, res, next) => {
  if (
    (!req.headers.authorization ||
      !req.headers.authorization.startsWith("Bearer ")) &&
    !getAuth().currentUser
  ) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const token = req.headers.authorization.split("Bearer ")[1];
    const decoded = jwt.verify(token, env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    switch (err.name) {
      case "TokenExpiredError":
        return res.status(401).json({ message: "TOKEN_EXPIRED" });
      case "JsonWebTokenError":
        return res.status(401).json({ message: "TOKEN_INVALID" });
      default:
        return res.status(500).json(err);
    }
  }
};

module.exports = verifyToken;
