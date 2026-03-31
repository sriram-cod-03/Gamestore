const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { 
    type: String, 
    required: function() { return !this.isGoogleUser; } 
  },
  lastName: { type: String, required: false },
  username: { 
    type: String, 
    unique: true, 
    sparse: true // Allows existing users without usernames to stay valid
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true
  },
  password: { 
    type: String, 
    required: function() { return !this.isGoogleUser; } 
  },
  mobile: { type: String, required: false },
  profilePic: { type: String, default: "" },
  isGoogleUser: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);