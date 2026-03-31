const express = require('express');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config(); 

// Import your routes
const usersRouter = require('./routes/users.js'); 

const app = express();

// --- MIDDLEWARES ---
// In production, you might want to allow your specific frontend URL
app.use(cors({ 
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', 
  credentials: true 
}));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// --- ROUTES ---
app.use('/api/users', usersRouter); 

// --- DB CONNECTION ---
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error('❌ DB Error:', err.message));

// --- 404 CATCHER ---
app.use((req, res) => res.status(404).json({ message: "Route Not Found" }));

// --- START SERVER ---
// ✅ THE FIX: Use Render's port first, then 5000 as a backup for your laptop
const PORT = process.env.PORT || 5000; 

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📡 Ready for Quick Access`);
});

module.exports = app;