const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
  movies: [{
    tmdbId: String,
    title: String,
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    addedAt: { type: Date, default: Date.now }
  }]
});

module.exports = mongoose.model('groups', groupSchema);
