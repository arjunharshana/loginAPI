const User = require("../models/User");
const bcrypt = require("bcrypt");
const generateOtp = require("../utils/generateOtp");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../utils/sendEmail");

signUp = async (request, response) => {
  try {
    const { username, email, password } = request.body;

    if (!username || !email || !password) {
      return response.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return response.status(400).json({ message: "User already exists" });
    }

    const otp = generateOtp();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    const newUser = new User({
      username,
      email,
      password,
      otp,
      otpExpiry,
    });

    await newUser.save();
    await sendOTP(email, otp);

    response.status(201).json({
      message: "User registered successfully. Please verify your OTP",
      userId: newUser._id,
    });
  } catch (error) {
    response.status(500).json({ message: "Server error" });
  }
};

verifyOtp = async (request, response) => {
  try {
    const { email, otp } = request.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.isVerified) {
      return response.status(400).json({
        message: "User already verified",
      });
    }

    if (user.otp != otp) {
      return response.status(400).json({
        message: "Invalid OTP",
      });
    }

    if (user.otpExpiry < Date.now()) {
      return response.status(400).json({
        message: "OTP expired",
      });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;

    await user.save();

    response.status(200).json({
      message: "Email verified succesfully",
    });
  } catch (error) {
    response.status(500).json({ message: "Server error" });
  }
};
