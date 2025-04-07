const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  url: { type: String, required: true },
  userData: { type: Object, required: true },
  status: { type: String, default: 'Applied' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Job', jobSchema);