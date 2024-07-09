const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  tconst: { type: String, required: true, unique: true },
  titleType: String,
  primaryTitle: String,
  originalTitle: String,
  isAdult: Boolean,
  startYear: Number,
  endYear: Number,
  runtimeMinutes: Number,
  genres: [String],
  averageRating: { type: Number, default: 0 },
  numVotes: { type: Number, default: 0 },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  ratings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Rating' }]
});

module.exports = mongoose.model('Movie', movieSchema);
