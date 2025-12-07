const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'pro'], default: 'user' },
  
  // Fields specific to Professional
  score: { type: Number, default: 0, min: 0, max: 100 }, // Reputation score
  availability: [{
    type: Date // Array of available time slots
  }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
