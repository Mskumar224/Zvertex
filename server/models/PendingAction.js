const mongoose = require('mongoose');

const pendingActionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true },
  data: { type: Object, required: true },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: '24h' },
});

module.exports = mongoose.model('PendingAction', pendingActionSchema);