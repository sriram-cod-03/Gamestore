const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String },
  username: { type: String, unique: true, sparse: true }, 
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  mobile: { type: String },
  gender: { type: String, default: "Not Specified" },
  bio: { type: String, default: "" },
  profilePic: { type: String, default: "" }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);