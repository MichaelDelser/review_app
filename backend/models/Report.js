const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  referenceId: { type: mongoose.Schema.Types.ObjectId, required: true }, // Reference to Review or User
  referenceType: { type: String, enum: ['Review', 'User'], required: true },
  reason: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Report', reportSchema);
