const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../Models/User');

router.get('/test', (req, res) => {
  res.send('✅ Users Route Working!');
});


// ✅ Signup Route
router.post('/signup', async (req, res) => {
  try {
    const { firstName, lastName, email, password, mobile } = req.body;

    // check existing user
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User already exists!' });

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // save user
    const newUser = new User({ firstName, lastName, email, password: hashedPassword, mobile });
    await newUser.save();

    res.json({ message: 'Signup successful! ✅' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error ❌' });
  }
});

// ✅ Login Route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid password' });

    // create token
    const token = jwt.sign({ id: user._id, email: user.email }, 'secretKey', { expiresIn: '1h' });

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error ❌' });
  }
});

module.exports = router;
