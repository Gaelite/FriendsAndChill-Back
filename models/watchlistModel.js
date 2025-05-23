// models/watchlistModel.js
const mongoose = require('mongoose');

const watchlistSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  name: { type: String, required: true },
  movies: [{
    tmdbId: String,
    title: String,
    poster: String,
    addedAt: { type: Date, default: Date.now }
  }]
});

module.exports = mongoose.model('watchlists', watchlistSchema);
