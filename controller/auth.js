require("dotenv").config();
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userModel = require("../models/Users.model");
const UsersModel = require("../models/Users.model");
const Token = require("../models/Token.model");
const sendEmail = require("../utils/email");

const jwt_secret = process.env.jwt_secret;

//signup user
const registerUser = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;

    // Input validation
    if (!email || !password || !confirmPassword) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    //search existing user
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    //compare password
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Password do not match" });
    }

    //encrypt password
    const encryptedPassword = await bcrypt.hash(password, 10);

    //generate verification token
    const verificationToken = crypto.randomBytes(40).toString("hex");

    // create a new user object
    const newUser = new userModel({
      email,
      password: encryptedPassword,
      verificationToken,
    });

    // save the new user object to the database
    await newUser.save();

    // construct and send the verification email
    const message = `http://localhost:4200/verify/${verificationToken}`;
    await sendEmail(newUser.email, "Verify Email", message);

    // return a success response with the user's email and verification token
    res.status(201).json({
      email: newUser.email,
      msg: "Success, please check your email to verify",
      verificationToken,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Error registering user" });
  }
};

//verify user
const verifyUser = async (req, res) => {
  try {
    const user = await userModel.findOne({
      verificationToken: req.params.verificationToken,
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid verification token" });
    }

    // Update user's isVerified field to true
    user.isVerified = true;
    user.verificationToken = undefined;

    await user.save();

    return res
      .status(200)
      .json({ message: "Account verified successfully, kindly login" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

//login user
const loginUser = async (req, res) => {
  const user = req.body;

  //find email
  const existingUser = await userModel.findOne({ email: user.email });
  if (!existingUser) {
    return res.status(400).json({ error: "User does not exist" });
  }

  // Check if the user has verified their email
  if (!existingUser.isVerified) {
    return res
      .status(419)
      .json({ error: "Please verify your email before logging in" });
  }

  //compare the password with the signup password
  const passwordMatch = await bcrypt.compare(
    user.password,
    existingUser.password
  );

  //invalid password
  if (!passwordMatch) {
    res.status(403).json({ status: "error", error: "Invalid password" });
  } else {
    const token = jwt.sign({ email: user.email }, jwt_secret, {
      expiresIn: "1h",
    });
    res.status(201).json({ status: "ok", data: token });
  }
};

//forget-password
const resetPassword = async (req, res) => {
  const { email } = req.body;

  //find email
  const existingUser = await userModel.findOne({ email });
  if (!existingUser) {
    return res.status(404).json({ error: "User not found" });
  }

  // Generate a password reset token and save it to the user's account
  const resetToken = crypto.randomBytes(20).toString("hex");
  existingUser.passwordToken = resetToken;
  existingUser.passwordTokenExpirationDate = Date.now() + 3600000; // Token expires in 1 hour
  await existingUser.save();

  // Send an email to the user with a link to reset their password
  const message = `http://localhost:4200/change-password/${resetToken}`;
  await sendEmail(existingUser.email, "Reset Password", message);
  console.log("Email sent");
  res.status(200).json({ message: "Password reset link sent to your email" });
};

//check passwordToken validity change-password
const checkValidity = async (req, res) => {
  try {
    const user = await userModel.findOne({ passwordToken: req.params.passwordToken });

    if (user) {
      return res.status(200).json({ validToken: true });
    } else {
      return res.status(400).json({ validToken: false, error: 'Invalid password token' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}


//change password
const changePassword = async (req, res) => {
  try {
    const user = await userModel.findOne({
      passwordToken: req.params.passwordToken,
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid password token" });
    }

    const { password, confirmPassword } = req.body;

    // compare password
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    const newPassword = await bcrypt.hash(password, 10);

    user.password = newPassword;
    user.passwordToken = undefined;

    await user.save();

    return res
      .status(200)
      .json({ message: "Password changed successfully, kindly login" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  registerUser,
  verifyUser,
  loginUser,
  resetPassword,
  checkValidity,
  changePassword,
};
