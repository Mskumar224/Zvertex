const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  title: { type: String, required: true },
  company: { type: String, required: true },
  status: { type: String, default: 'Applied' },
  appliedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Job', jobSchema);