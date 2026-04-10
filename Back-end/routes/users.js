const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// ✅ CRITICAL: Match the case exactly for Render (Capital 'U')
const User = require('../models/user.js'); 

// --- 1. SIGNUP ROUTE ---
router.post('/signup', async (req, res) => {
  try {
    const { firstName, lastName, email, password, mobile, username } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists!' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      email,
      username: username || email.split('@')[0], // Default handle if not provided
      password: hashedPassword,
      mobile
    });

    await newUser.save();
    res.json({ success: true, message: 'Signup successful! ✅' });
  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ success: false, message: 'Server error during signup' });
  }
});

// --- 2. MULTI-ID LOGIN (Email, Username, or Mobile) ---
router.post('/login', async (req, res) => {
  const { identifier, password } = req.body;
  try {
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

    const token = jwt.sign(
      { id: user._id }, 
      process.env.JWT_SECRET || 'secret123', 
      { expiresIn: '7d' }
    );
    
    res.json({ 
      success: true, 
      token, 
      user: { 
        _id: user._id,
        firstName: user.firstName, 
        lastName: user.lastName,
        email: user.email,
        username: user.username,
        mobile: user.mobile,
        bio: user.bio,
        gender: user.gender,
        profilePic: user.profilePic
      } 
    });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ success: false, error: "Login failed" });
  }
});

// --- 3. PROFILE UPDATE (Saves Bio, Gender, ProfilePic) ---
router.put('/update-profile', async (req, res) => {
  const { userId, username, bio, gender, profilePic } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username, bio, gender, profilePic },
      { new: true } // Returns the updated document
    ).select('-password'); // Don't send the password back!

    res.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Update Error:", error);
    res.status(500).json({ success: false, error: "Profile update failed" });
  }
});

// --- 4. GET ALL PLAYERS (For your Users.jsx Page) ---
router.get('/all-players', async (req, res) => {
  try {
    // Only fetching necessary public data
    const players = await User.find().select('firstName username profilePic bio gender').sort({ createdAt: -1 });
    res.json({ success: true, players });
  } catch (error) {
    console.error("Fetch Players Error:", error);
    res.status(500).json({ success: false, message: "Failed to fetch players" });
  }
});

// --- 5. QUICK ACCESS (RECOVERY/AUTO-LOGIN) ---
router.post('/quick-access', async (req, res) => {
  const { identifier } = req.body;
  try {
    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }, { mobile: identifier }]
    });

    if (!user) return res.status(404).json({ success: false, error: "Player not found!" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret123', { expiresIn: '7d' });
    res.json({ success: true, token, user });
  } catch (error) {
    res.status(500).json({ success: false, error: "Recovery failed" });
  }
});

module.exports = router;