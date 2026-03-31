const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../Models/User');

// --- 1. SIGNUP ROUTE ---
router.post('/signup', async (req, res) => {
  try {
    const { firstName, lastName, email, password, mobile, username } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ success: false, message: 'User already exists!' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstName,
      lastName,
      email,
      username: username || email.split('@')[0], // Automatically creates username if empty
      password: hashedPassword,
      mobile
    });

    await newUser.save();
    res.json({ success: true, message: 'Signup successful! ✅' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error during signup ❌' });
  }
});

// --- 2. MULTI-IDENTIFIER LOGIN ---
router.post('/login', async (req, res) => {
  const { identifier, password } = req.body; // Changed 'email' to 'identifier'
  try {
    // Search by Email OR Username OR Mobile
    const user = await User.findOne({
      $or: [
        { email: identifier },
        { username: identifier },
        { mobile: identifier }
      ]
    });

    if (!user) return res.status(404).json({ success: false, error: "Player not found!" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ success: false, error: "Invalid password!" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret123', { expiresIn: '7d' });
    res.json({ success: true, token, user: { firstName: user.firstName, email: user.email } });
  } catch (error) {
    res.status(500).json({ success: false, error: "Login failed" });
  }
});

// --- 3. QUICK ACCESS (RECOVERY) ---
router.post('/quick-access', async (req, res) => {
  const { identifier } = req.body; 
  try {
    const user = await User.findOne({
      $or: [
        { email: identifier },
        { username: identifier },
        { mobile: identifier }
      ]
    });

    if (!user) return res.status(404).json({ success: false, error: "Player not found!" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret123', { expiresIn: '7d' });
    res.json({ success: true, token, user: { firstName: user.firstName, email: user.email } });
  } catch (error) {
    res.status(500).json({ success: false, error: "Recovery failed" });
  }
});

module.exports = router;