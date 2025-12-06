// app.js
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var mongoose = require('mongoose');
require('dotenv').config();  // load .env

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var paymentRouter = require('./routes/payment'); // ✅ payment routes

var app = express();

// CORS – for now allow all; later restrict to Netlify domain
app.use(
  cors({
    origin: '*',
    credentials: true,
  })
);

// MongoDB connection
const mongoURI =
  process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/gamestoreDB';

mongoose
  .connect(mongoURI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.log('❌ DB Error:', err));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', indexRouter);
app.use('/api', usersRouter);          // /api/signup, /api/login, /api/test
app.use('/api/payment', paymentRouter); // /api/payment/checkout, /test

module.exports = app;
