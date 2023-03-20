const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: {
      type: String,
      minlength: 3,
      maxlength: 50,
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Email is required"],
      validate: {
        validator: validator.isEmail,
        message: "Check your email field",
      },
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },
    profilePicture: {
      type: String,
      default: "default.png",
    },
    phone: {
      type: Number,
    },
    birthday: {
      type: String,
    },
    address: {
      type: String,
    },
    gender: {
      type: String,
    },
    location: {
      type: String,
    },
    skills: {
      type: [],
    },
    tools: {
      type: [],
    },
    aboutMe: {
      type: String,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
    },
    verificationToken: String,
    isVerified: {
      type: Boolean,
      default: false,
    },
    verified: Date,
    passwordToken: {
      type: String,
    },
    passwordTokenExpirationDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

userSchema.methods.checkPassword = async function (password) {
  const isMatch = await bcrypt.compare(password, this.password);
  return isMatch;
};

module.exports = mongoose.model("userModel", userSchema);
