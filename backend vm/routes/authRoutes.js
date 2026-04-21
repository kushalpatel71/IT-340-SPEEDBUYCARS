const express = require("express");
const User = require("../models/User");
const LoginPasscode = require("../models/LoginPasscode");
const { hashPassword, comparePassword } = require("../utils/crypto");
const { sendEmail } = require("../utils/mailer");
const {
  registerUserEmail,
  loginPasscodeEmail
} = require("../utils/emailTemplates");

const router = express.Router();

function generatePasscode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

router.post("/register", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "Email already registered." });
    }

    const passwordHash = await hashPassword(password);

    const user = await User.create({
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      passwordHash
    });

    await sendEmail({
      to: user.email,
      subject: "Welcome to SpeedBuyCars",
      html: registerUserEmail(user),
      text: `Hello ${user.fullName}, your SpeedBuyCars account was created successfully.`
    });

    return res.status(201).json({
      success: true,
      message: "Registration successful. Confirmation email sent."
    });
  } catch (error) {
    console.error("Register error:", error);
    return res.status(500).json({ success: false, message: "Server error." });
  }
});

router.post("/send-passcode", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required." });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    const isMatch = await comparePassword(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    await LoginPasscode.deleteMany({ email: normalizedEmail });

    const code = generatePasscode();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await LoginPasscode.create({
      email: normalizedEmail,
      code,
      expiresAt,
      used: false
    });

    await sendEmail({
      to: normalizedEmail,
      subject: "Your SpeedBuyCars Login Passcode",
      html: loginPasscodeEmail(user.fullName, code),
      text: `Your SpeedBuyCars login passcode is ${code}. It expires in 5 minutes.`
    });

    return res.json({
      success: true,
      message: "Passcode sent to your email."
    });
  } catch (error) {
    console.error("Send passcode error:", error);
    return res.status(500).json({ success: false, message: "Failed to send passcode." });
  }
});

router.post("/verify-passcode", async (req, res) => {
  try {
    const { email, passcode } = req.body;

    if (!email || !passcode) {
      return res.status(400).json({ success: false, message: "Email and passcode are required." });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const record = await LoginPasscode.findOne({
      email: normalizedEmail,
      code: passcode.trim(),
      used: false
    }).sort({ createdAt: -1 });

    if (!record) {
      return res.status(401).json({ success: false, message: "Invalid passcode." });
    }

    if (record.expiresAt.getTime() < Date.now()) {
      return res.status(401).json({ success: false, message: "Passcode expired. Please request a new one." });
    }

    record.used = true;
    await record.save();

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    return res.json({
      success: true,
      message: "Correct passcode. Login successful.",
      user: {
        fullName: user.fullName,
        email: user.email,
        loggedIn: true
      }
    });
  } catch (error) {
    console.error("Verify passcode error:", error);
    return res.status(500).json({ success: false, message: "Failed to verify passcode." });
  }
});

module.exports = router;