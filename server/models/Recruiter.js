const mongoose = require('mongoose');

const recruiterSchema = new mongoose.Schema({
  name: String,
  email: String
});

module.exports = mongoose.model('Recruiter', recruiterSchema);