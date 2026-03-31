const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// --- 1. SIGNUP ---
router.post('/signup', async (req, res) => {
  try {
    const { firstName, email, password, mobile, username } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ success: false, message: 'User already exists!' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstName,
      email,
      username: username || email.split('@')[0],
      password: hashedPassword,
      mobile
    });

    await newUser.save();
    res.json({ success: true, message: 'Signup successful! ✅' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error ❌' });
  }
});

// --- 2. MULTI-ID LOGIN & RECOVERY ---
router.post('/login', async (req, res) => {
  const { identifier, password } = req.body;
  try {
    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }, { mobile: identifier }]
    });

    if (!user) return res.status(404).json({ success: false, error: "Player not found!" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ success: false, error: "Invalid password!" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    res.json({ success: true, token, user: { firstName: user.firstName, email: user.email } });
  } catch (error) {
    res.status(500).json({ success: false, error: "Login failed" });
  }
});

// Recovery Mode (No Password)
router.post('/quick-access', async (req, res) => {
  const { identifier } = req.body;
  try {
    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }, { mobile: identifier }]
    });
    if (!user) return res.status(404).json({ success: false, error: "Player not found!" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    res.json({ success: true, token, user: { firstName: user.firstName, email: user.email } });
  } catch (error) {
    res.status(500).json({ success: false, error: "Recovery failed" });
  }
});

module.exports = router;