const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  filename: String,
  data: Buffer,
  mimetype: String,
  description: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  extractedTech: String,
  extractedRole: String,
  extractedText: String,
  additionalDetails: {
    address: String,
    linkedin: String,
    github: String,
    portfolio: String,
    experience: String,
    education: String,
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Profile', profileSchema);