const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  token:    { type: String },
  active:   { type: Boolean, default: true },

  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
  friendRequestsReceived: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
  friendRequestsSent: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users' }],
});


module.exports = mongoose.model('users', userSchema);
