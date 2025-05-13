const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  jobId: String,
  title: String,
  company: String,
  link: String,
  applied: { type: Boolean, default: false },
  requiresDocs: Boolean,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  profile: { type: mongoose.Schema.Types.ObjectId, ref: 'Profile' },
  contactEmail: String,
  contactPhone: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Job', jobSchema);