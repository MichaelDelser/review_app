const mongoose = require('mongoose');

const nameSchema = new mongoose.Schema({
  nconst: { type: String, required: true, unique: true },
  primaryName: String,
  birthYear: Number,
  deathYear: Number,
  primaryProfession: [String],
  knownForTitles: [String], // Reference to Movie tconst
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
});

module.exports = mongoose.model('Name', nameSchema);
