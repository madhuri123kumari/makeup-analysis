const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
    },

    profileImage: {
      type: String,
      default: "",
    },

    skinType: {
      type: String,
      default: "",
    },

    skinTone: {
      type: String,
      default: "",
    },

    gender: {
      type: String,
      default: "",
    },

    age: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);