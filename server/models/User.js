const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  subscriptionType: { 
    type: String, 
    enum: ['STUDENT', 'RECRUITER', 'BUSINESS'], 
    default: 'STUDENT' 
  },
  resume: { type: String },
  appliedJobs: [{
    jobId: { type: String }, // Store job identifier if not using ObjectId
    date: { type: Date, default: Date.now }, // Application date
    _id: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' } // Reference to Job
  }],
  resetToken: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);