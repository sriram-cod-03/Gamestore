const express = require('express');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config(); 

// --- ROUTE IMPORTS ---
const usersRouter = require('./routes/users.js'); 

const app = express();

// --- DB CONNECTION ---
// Make sure your .env file has MONGODB_URI=mongodb://localhost:27017/gamestore
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gamestore')
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error('❌ DB Error:', err.message));

// --- MIDDLEWARES ---
app.use(cors({ 
  origin: 'http://localhost:5173', // Your React Frontend Port
  credentials: true 
}));
app.use(express.json()); // Essential to read data from your Login Page
app.use(express.static(path.join(__dirname, 'public')));

// --- ROUTES ---
// This prefix means all routes in users.js start with /api/users
app.use('/api/users', usersRouter); 

// --- 404 HANDLER ---
// If the URL doesn't match any route above, this catches it
app.use((req, res) => {
  console.log(`404 Error: ${req.method} ${req.url} not found`);
  res.status(404).json({ message: "Address Not Found on Server" });
});

// --- START SERVER ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📡 Ready for Quick Access at http://localhost:${PORT}/api/users/quick-access`);
});

module.exports = app;