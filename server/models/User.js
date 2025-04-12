const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  subscriptionType: {
    type: String,
    enum: ['trial', 'student', 'recruiter', 'business'],
    default: 'trial',
  },
  trialEnd: { type: Date },
  phone: { type: String },
  resume: { type: String },
  technologies: [String],
  companies: [String],
  recruiterProfiles: [
    {
      name: String,
      email: String,
      resume: String,
      technologies: [String],
      companies: [String],
    },
  ],
  businessRecruiters: [
    {
      name: String,
      email: String,
      subscriptionType: { type: String, default: 'recruiter' },
      profiles: [
        {
          name: String,
          email: String,
          resume: String,
          technologies: [String],
          companies: [String],
        },
      ],
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', userSchema);