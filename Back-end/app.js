const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config(); 

const userRoutes = require('./routes/users.js');

const app = express();

// --- MIDDLEWARES ---
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// --- ROUTES ---
app.use('/api/users', userRoutes);

// --- DB CONNECTION ---
const dbURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gamestore';

mongoose.connect(dbURI)
  .then(() => {
    // ✅ THIS LOG CONFIRMS THE DATABASE NAME
    const dbName = mongoose.connection.name;
    console.log(`✅ MongoDB Connected to database: ${dbName}`);
  })
  .catch((err) => console.error('❌ DB Error:', err.message));

// --- START SERVER ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = app;