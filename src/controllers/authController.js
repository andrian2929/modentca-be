const UserModel = require("../models/User");
const jwt = require("jsonwebtoken");
const env = require("../config/env");
const authValidation = require("../validation/authValidation");
const {
  getAuth,
  createUserWithEmailAndPassword: firebaseCreateUser,
  signInWithEmailAndPassword: firebaseSignIn,
  sendEmailVerification: firebaseSendEmailVerification,
  signOut: firebaseSignOut,
  reauthenticateWithCredential: firebaseReauthenticateUser,
  sendPasswordResetEmail: firebaseSendPasswordResetEmail,
  EmailAuthProvider,
} = require("firebase/auth");

const firebaseAuthErrorCodes = require("../utils/firebaseAuthErrorCodes");

/**
 * Sign up controlller.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Object} - Response JSON object.
 */
const signUp = async (req, res) => {
  try {
    const { parentEmail: email, password } = req.body;
    const { err } = authValidation.signUp(req.body);

    if (err) {
      return res
        .status(422)
        .json({ error: { message: err.details[0].message } });
    }

    try {
      const auth = getAuth();
      await firebaseCreateUser(auth, email, password);
    } catch (err) {
      if (err.name === "FirebaseError") {
        if (err.code === "auth/email-already-in-use") {
          return res
            .status(409)
            .json({ error: { message: "EMAIL_ALREADY_IN_USE" } });
        }
      }
      return res.status(500).json({ error: err });
    }

    const user = new UserModel(req.body);
    await user.save();

    return res.status(201).json({ message: "CREATED", data: user });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
};

/**
 * Sign in controller.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Object} - Response JSON object.
 */
const signIn = async (req, res) => {
  try {
    const auth = getAuth();
    const { err } = authValidation.signIn(req.body);

    if (err)
      return res
        .status(422)
        .json({ error: { message: err.details[0].message } });

    const { email, password } = req.body;
    const userCredential = await firebaseSignIn(auth, email, password);

    const authenticatedUser = userCredential.user;
    const user = await UserModel.findOne({
      parentEmail: authenticatedUser.email,
    }).lean();

    user.emailVerified = authenticatedUser.emailVerified;

    const { _id, role } = user;
    const token = jwt.sign({ _id, role }, env.JWT_SECRET, { expiresIn: "7d" });
    return res.status(200).json({
      message: "OK",
      data: user,
      token,
    });
  } catch (err) {
    if ((err.name = "FirebaseError")) {
      const { errorMessage, statusCode } = firebaseAuthErrorCodes(err);
      return res.status(statusCode).json({ error: { message: errorMessage } });
    }
    return res.status(500).json({ error: err });
  }
};

/**
 * Sign out controller.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Object} - Response JSON object.
 */
const signOut = async (req, res) => {
  const auth = getAuth();
  try {
    await firebaseSignOut(auth);
    return res.status(200).json({ message: "OK" });
  } catch (err) {
    return res.status(500).json({ error: err });
  }
};

/**
 * Get current user controller.
 *
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Object} - Response JSON object.
 */
const getMe = async (req, res) => {
  try {
    const auth = getAuth();
    const user = await UserModel.findById(req.user?._id).lean();
    const authenticatedUser = auth.currentUser;
    user.emailVerified = authenticatedUser.emailVerified;
    return res.status(200).json(user);
  } catch (err) {
    console.log(err);
  }
};

/**
 * Send email verification controller.
 *
 * @param {Object} req
 * @param {Object} res
 * @returns
 */
const sendEmailVerification = async (req, res) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user)
      return res.status(401).json({ error: { message: "UNAUTHORIZED" } });
    await firebaseSendEmailVerification(user);
    return res.status(200).json({ message: "EMAIL_SENT" });
  } catch (err) {
    return res
      .status(500)
      .json({ error: { message: "INTERNAL_SERVER_ERROR" } });
  }
};

const reauthenticateUser = async (req, res) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user)
      return res.status(401).json({ error: { message: "UNAUTHORIZED" } });

    const { password, email } = req.body;
    const credential = EmailAuthProvider.credential(email, password);

    await firebaseReauthenticateUser(user, credential);

    return res.status(200).json({ message: "OK" });
  } catch (err) {
    if ((err.name = "FirebaseError")) {
      const { errorMessage, statusCode } = firebaseAuthErrorCodes(err);
      return res.status(statusCode).json({ error: { message: errorMessage } });
    }

    return res
      .status(500)
      .json({ error: { message: "INTERNAL_SERVER_ERROR" } });
  }
};

const sendPasswordResetEmail = async (req, res) => {
  try {
    const auth = getAuth();
    const { email } = req.body;
    await firebaseSendPasswordResetEmail(auth, email);
    return res.status(200).json({ message: "OK" });
  } catch (err) {
    if ((err.name = "FirebaseError")) {
      const { errorMessage, statusCode } = firebaseAuthErrorCodes(err);
      return res.status(statusCode).json({ error: { message: errorMessage } });
    }

    return res
      .status(500)
      .json({ error: { message: "INTERNAL_SERVER_ERROR" } });
  }
};

module.exports = {
  signUp,
  signIn,
  signOut,
  getMe,
  sendEmailVerification,
  reauthenticateUser,
  sendPasswordResetEmail,
};
