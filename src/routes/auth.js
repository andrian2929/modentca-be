const { Router } = require("express");
const verifyToken = require("../middleware/auth");

const {
  signIn,
  signOut,
  signUp,
  getMe,
  sendEmailVerification,
  reauthenticateUser,
  sendPasswordResetEmail,
} = require("../controllers/authController");

const router = Router();

router.post("/sign-up", signUp);
router.post("/sign-in", signIn);
router.post("/sign-out", verifyToken, signOut);
router.post("/send-email-verification", verifyToken, sendEmailVerification);
router.post("/reauthenticate", verifyToken, reauthenticateUser);
router.post("/password-reset", sendPasswordResetEmail);
router.get("/me", verifyToken, getMe);

module.exports = router;
