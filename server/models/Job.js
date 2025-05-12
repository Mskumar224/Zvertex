const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  jobId: String, // No unique constraint
  title: String,
  company: String,
  link: String,
  applied: { type: Boolean, default: false },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Job', jobSchema);