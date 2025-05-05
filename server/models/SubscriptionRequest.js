const mongoose = require('mongoose');

const subscriptionRequestSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  plan: { type: String, required: true, enum: ['STUDENT', 'RECRUITER', 'BUSINESS'] },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('SubscriptionRequest', subscriptionRequestSchema);