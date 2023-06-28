const mongoose = require("mongoose");
const DateTime = require("../config/time");

const { Schema, model } = mongoose;

const ParentSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, default: null },
  relation: { type: String, enum: ["ayah", "ibu"], required: true },
  birthDate: { type: Date, default: null },
  phoneNumber: { type: String, default: null },
});

const UserSchema = new Schema(
  {
    firstName: { type: String, required: null },
    lastName: { type: String, default: null },
    parentEmail: { type: String, unique: true, required: true },
    birthDate: { type: Date, default: null },
    image: { type: String, default: null },
    sex: { type: String, enum: ["L", "P", null], default: null },
    role: {
      type: String,
      enum: ["user", "health_care", "email"],
      default: "user",
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    parent: ParentSchema,
  },
  { timestamps: true, versionKey: false }
);

const User = model("User", UserSchema);
module.exports = User;
