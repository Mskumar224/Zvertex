const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  title: { type: String, required: true },
  company: { type: String, required: true },
  status: { type: String, default: 'Applied' },
  appliedAt: { type: Date, default: Date.now },
});

// Create unique compound index to prevent duplicate applications
jobSchema.index({ userId: 1, title: 1, company: 1 }, { unique: true });

module.exports = mongoose.model('Job', jobSchema);