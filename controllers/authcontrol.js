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

verifyOTP = async(req, res);
