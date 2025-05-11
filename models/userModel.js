const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  authToken: String,
  token: String,
  active: Boolean,
});

module.exports = mongoose.model('users', userSchema);
