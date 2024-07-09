const mongoose = require('mongoose');

const titleEpisodeSchema = new mongoose.Schema({
  tconst: { type: String, required: true, unique: true },
  parentTconst: { type: String, required: true }, // Reference to Movie tconst
  seasonNumber: Number,
  episodeNumber: Number,
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
});

module.exports = mongoose.model('TitleEpisode', titleEpisodeSchema);
