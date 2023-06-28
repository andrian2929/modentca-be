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
  const auth = getAuth();
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("Bearer ")
  )
    return res.status(401).json({ error: { message: "UNAUTHORIZED" } });

  if (!auth.currentUser)
    return res.status(401).json({ error: { message: "UNAUTHORIZED" } });

  try {
    const token = req.headers.authorization.split("Bearer ")[1];
    const decoded = jwt.verify(token, env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    switch (err.name) {
      case "TokenExpiredError":
        return res.status(401).json({ error: { message: "TOKEN_EXPIRED" } });
      case "JsonWebTokenError":
        return res.status(401).json({ error: { message: "INVALID_TOKEN" } });
      default:
        return res.status(500).json(err);
    }
  }
};

module.exports = verifyToken;
