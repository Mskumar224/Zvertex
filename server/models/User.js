const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: String,
  fullName: String,
  address: String,
  resume: String,
  appliedJobs: [{ jobId: String, technology: String, date: Date }],
});

module.exports = mongoose.model('User', userSchema);