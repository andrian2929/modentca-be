const UserModel = require("../models/User");
const jwt = require("jsonwebtoken");
const env = require("../config/env");
const authValidation = require("../validation/authValidation");
const {
  getAuth,
  createUserWithEmailAndPassword: firebaseCreateUser,
  signInWithEmailAndPassword: firebaseSignIn,
  signInWithCredential: firebaseSignInWithCredential,
  GoogleAuthProvider,
  sendEmailVerification: firebaseSendEmailVerification,
  signOut: firebaseSignOut,
  reauthenticateWithCredential: firebaseReauthenticateUser,
  sendPasswordResetEmail: firebaseSendPasswordResetEmail,
  EmailAuthProvider,
  deleteUser: firebaseDeleteUser,
  updatePassword: firebaseUpdatePassword,
} = require("firebase/auth");

const firebaseAuthErrorCodes = require("../utils/firebaseAuthErrorCodes");

/**
 * Sign up controlller.
 *
 * @async
 * @function signUp
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Object} - Response JSON object.
 * @throws {Error} - If there is an error signing up.
 */
const signUp = async (req, res) => {
  try {
    const { parentEmail: email, password } = req.body;
    const { error } = authValidation.signUp(req.body);

    if (error) {
      return res
        .status(422)
        .json({ error: { message: error.details[0].message } });
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
 * @async
 * @function signIn
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Object} - Response JSON object.
 * @throws {Error} - If there is an error signing in.
 */
const signIn = async (req, res) => {
  try {
    const auth = getAuth();
    const { error } = authValidation.signIn(req.body);

    if (error)
      return res
        .status(422)
        .json({ error: { message: error.details[0].message } });

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
 * @aync
 * @function signOut
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Object} - Response JSON object.
 * @throws {Error} - If there is an error signing out.
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
 * @async
 * @function getMe
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Object} - Response JSON object.
 * @throws {Error} - If there is an error getting the current user.
 */
const getMe = async (req, res) => {
  try {
    const auth = getAuth();
    const user = await UserModel.findById(req.user?._id).lean();
    const authenticatedUser = auth.currentUser;
    user.emailVerified = authenticatedUser?.emailVerified;
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ error: err });
  }
};

/**
 * Send email verification controller.
 *
 * @async
 * @function sendEmailVerification
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Object} - Response JSON object.
 * @throws {Error} - If there is an error sending the email verification.
 */
const sendEmailVerification = async (req, res) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user)
      return res.status(401).json({ error: { message: "UNAUTHORIZED" } });
    if (user.emailVerified)
      return res
        .status(400)
        .json({ error: { message: "EMAIL_ALREADY_VERIFIED" } });
    await firebaseSendEmailVerification(user);
    return res.status(200).json({ message: "EMAIL_SENT" });
  } catch (err) {
    return res
      .status(500)
      .json({ error: { message: "INTERNAL_SERVER_ERROR" } });
  }
};

/**
 * Reauthenticate user controller.
 *
 * @async
 * @function reauthenticateUser
 * @param {Object} req - Express request object.
 * @param {Obect} res - Express response object.
 * @returns  {Object} - Response JSON object.
 */
const reauthenticateUser = async (req, res) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user)
      return res.status(401).json({ error: { message: "UNAUTHORIZED" } });

    const { password, email } = req.body;
    const credential = EmailAuthProvider.credential(email, password);

    const reauthenticateUser = await firebaseReauthenticateUser(
      user,
      credential
    );

    const tokenId = await reauthenticateUser.user.getIdToken();

    return res.status(200).json({ data: tokenId });
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

/**
 * @async
 * @function sendPasswordResetEmail
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Object} - Response JSON object.
 * @throws {Error} - If there is an error sending the password reset email.
 */
const sendPasswordResetEmail = async (req, res) => {
  try {
    const auth = getAuth();
    const { email } = req.body;
    const { error } = authValidation.forgotPassword(req.body);
    if (error)
      return res.status(422).json({ error: { message: error.message } });

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

/**
 * Delete user account controller.
 *
 * @async
 * @function deleteAccount
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Object} - Response JSON object.
 * @throws {Error} - If there is an error deleting the user account.
 */
const deleteAccount = async (req, res) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user)
      return res.status(401).json({ error: { message: "UNAUTHORIZED" } });
    await firebaseDeleteUser(user);
    await UserModel.findOneAndDelete({ parentEmail: user.email });
    return res.status(204).json({ message: "OK" });
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

/**
 * Change password controller.
 *
 * @async
 * @function changePassword
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @returns {Object} - Response JSON object.
 * @throws {Error} - If there is an error changing the password.
 */
const changePassword = async (req, res) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    const { error } = authValidation.updatePassword(req.body);
    if (error)
      return res
        .status(422)
        .json({ error: { message: error.details[0].message } });

    const { currentPassword, newPassword } = req.body;

    const credential = EmailAuthProvider.credential(
      user.email,
      currentPassword
    );

    await firebaseReauthenticateUser(user, credential);
    await firebaseUpdatePassword(user, newPassword);

    return res.status(204).json({ message: "OK" });
  } catch (err) {
    if ((err.name = "FirebaseError")) {
      const { errorMessage, statusCode } = firebaseAuthErrorCodes(err);
      return res.status(statusCode).json({ error: { message: errorMessage } });
    }
    return res.status(500).json({ error: err });
  }
};

const signInWithGoogle = async (req, res) => {
  const auth = getAuth();
  const { idToken } = req.body;

  const { error } = authValidation.signInWithGoogle(req.body);
  if (error)
    return res
      .status(422)
      .json({ error: { message: error.details[0].message } });
  try {
    const credential = GoogleAuthProvider.credential(idToken);
    const authenticatedUser = await firebaseSignInWithCredential(
      auth,
      credential
    );

    let user;
    user = await UserModel.findOne({
      parentEmail: authenticatedUser.user.email,
    }).lean();

    if (!user) {
      user = new UserModel({
        parentEmail: authenticatedUser.user.email,
      });
      await user.save();
    }

    const { _id, role } = user;
    const token = jwt.sign({ _id, role }, env.JWT_SECRET, { expiresIn: "7d" });

    return res.status(200).json({ message: "OK", data: user, token });
  } catch (err) {
    if (err.name == "FirebaseError") {
      const { errorMessage, statusCode } = firebaseAuthErrorCodes(err);
      return res.status(statusCode).json({ error: { message: errorMessage } });
    }
    return res.status(500).json({ error: err });
  }
};

module.exports = {
  signUp,
  signIn,
  signInWithGoogle,
  signOut,
  getMe,
  sendEmailVerification,
  reauthenticateUser,
  sendPasswordResetEmail,
  deleteAccount,
  changePassword,
};
