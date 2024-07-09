const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  referenceId: { type: String, required: true }, // Can be tconst (Movie/Episode) or nconst (Name)
  referenceType: { type: String, enum: ['Movie', 'Name', 'Episode'], required: true },
  rating: { type: Number, required: true, min: 1.0, max: 10.0 },
  comment: { type: String, default: '' },
  helpfulness: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Review', reviewSchema);
