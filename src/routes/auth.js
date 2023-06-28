const { Router } = require("express");
const verifyToken = require("../middleware/auth");

const {
  signIn,
  signOut,
  signUp,
  signInWithGoogle,
  getMe,
  sendEmailVerification,
  sendPasswordResetEmail,
  changePassword,
  deleteAccount,
} = require("../controllers/authController");

const router = Router();

router.post("/sign-up", signUp);
router.post("/sign-in-with-google", signInWithGoogle);
router.post("/sign-in", signIn);
router.post("/sign-out", verifyToken, signOut);
router.post("/send-email-verification", verifyToken, sendEmailVerification);
router.delete("/delete-account", deleteAccount);
router.post("/password-reset", sendPasswordResetEmail);
router.post("/change-password", verifyToken, changePassword);
router.get("/me", verifyToken, getMe);

module.exports = router;
