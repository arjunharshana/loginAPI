const express = require("express");
const router = express.Router();
const authController = require("../controllers/authcontrol");

router.post("/signup", authController.signUp);
router.post("/verify-otp", authController.verifyOtp);
router.post("/login", authController.login);

module.exports = router;
