const mongoose = require("mongoose");
const env = require("./env");

/**
 * Establish a connection to MongoDB
 *
 * @async
 * @function connectDB
 * @returns {void}
 * @throws {Error} - If there is an error connecting to MongoDB
 */
const connectDB = async () => {
  try {
    await mongoose.connect(env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (err) {
    console.log(err.message);
  }
};

connectDB();
