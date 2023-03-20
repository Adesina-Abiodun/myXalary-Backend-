const express = require("express");
const path = require("path");

const UserModel = require("../models/Users.model");

const userProfile = async (req, res) => {
  const {
    email,
    name,
    phone,
    address,
    location,
    gender,
    birthday,
    skills,
    tools,
    profilePicture,
  } = req.body;

  if (
    !email ||
    !name ||
    !phone ||
    !address ||
    !location ||
    !gender ||
    !birthday ||
    !skills ||
    !tools ||
    !profilePicture
  ) {
    return res
      .status(400)
      .json({ error: "Please provide all required values" });
  }

  try {
    const user = await UserModel.findOne({ email});

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.email = email;
    user.name = name;
    user.phone = phone;
    user.location = location;
    user.gender = gender;
    user.address = address;
    user.birthday = birthday;
    user.skills = skills;
    user.tools = tools;
    user.profilePicture = profilePicture;

    await user.save();

    res.status(200).json({ user: "saved" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//Get userProfile details
const getUserProfile = async (req, res) => {
    try {
      const { email } = req.body;
      const user = await UserModel.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      res.status(200).json({
        email: user.email,
        name: user.name,
        phone: user.phone,
        address: user.address,
        location: user.location,
        gender: user.gender,
        birthday: user.birthday,
        skills: user.skills,
        tools: user.tools,
        profilePicture: user.profilePicture,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
  
module.exports = {
    userProfile,
    getUserProfile
}
