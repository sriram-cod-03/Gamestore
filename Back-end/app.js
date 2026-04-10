const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config(); 

// ✅ Ensure the filename case matches exactly: 'users.js'
const userRoutes = require('./routes/users.js');

const app = express();

// --- MIDDLEWARES ---
// Updated CORS to support both Localhost and your future Render Frontend URL
const allowedOrigins = ['http://localhost:5173', 'https://your-frontend-link.netlify.app']; 
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

// --- ROUTES ---
app.use('/api/users', userRoutes);

// Root Route (Helps you check if backend is alive on Render)
app.get('/', (req, res) => {
  res.send("🚀 GameStore Backend is Running Live!");
});

// --- DB CONNECTION ---
// On Render, make sure you have MONGODB_URI in your Environment Variables
const dbURI = process.env.MONGODB_URI;

if (!dbURI) {
  console.error("❌ ERROR: MONGODB_URI is not defined in Environment Variables!");
}

mongoose.connect(dbURI)
  .then(() => {
    const dbName = mongoose.connection.name;
    console.log(`✅ MongoDB Connected to database: ${dbName}`);
  })
  .catch((err) => {
    console.error('❌ DB Connection Error:', err.message);
  });

// --- START SERVER ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = app;