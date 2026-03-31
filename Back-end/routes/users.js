const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Ensure this path is correct

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
      username: username || email.split('@')[0],
      password: hashedPassword,
      mobile
    });

    await newUser.save();
    res.json({ success: true, message: 'Signup successful! ✅' });
  } catch (err) {
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

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret123', { expiresIn: '7d' });
    
    // Return full user object so frontend can update localStorage
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
        gender: user.gender
      } 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Login failed" });
  }
});

// --- 3. QUICK ACCESS (RECOVERY MODE) ---
router.post('/quick-access', async (req, res) => {
  const { identifier } = req.body;
  try {
    const user = await User.findOne({
      $or: [{ email: identifier }, { username: identifier }, { mobile: identifier }]
    });

    if (!user) return res.status(404).json({ success: false, error: "Player not found!" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret123', { expiresIn: '7d' });
    res.json({ 
      success: true, 
      token, 
      user: { 
        _id: user._id,
        firstName: user.firstName, 
        email: user.email,
        bio: user.bio,
        gender: user.gender
      } 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Recovery failed" });
  }
});

// --- 4. ✅ UPDATE PROFILE ROUTE (DATABASE STORAGE) ---
// This is the new "door" to save Bio and Gender to MongoDB
router.put('/update-profile', async (req, res) => {
  const { userId, username, bio, gender, profilePic } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username, bio, gender, profilePic }, // ✅ Add profilePic here
      { new: true }
    );
    res.json({ success: true, user: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, error: "Upload failed" });
  }
});

module.exports = router;