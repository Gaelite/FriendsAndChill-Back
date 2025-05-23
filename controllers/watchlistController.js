// controllers/watchlistController.js
const Watchlist = require('../models/watchlistModel');
const User = require('../models/userModel');

exports.createWatchlist = async (req, res) => {
  const { name } = req.body;
  const list = new Watchlist({ owner: req.user._id, name });
  await list.save();
  res.status(201).json(list);
};

exports.addMovieToList = async (req, res) => {
  const { listId } = req.params;
  const { tmdbId, title, poster } = req.body;

  const list = await Watchlist.findOne({ _id: listId, owner: req.user._id });
  if (!list) return res.status(403).json({ message: "No tienes acceso a esta lista." });

  list.movies.push({ tmdbId, title, poster });
  await list.save();

  res.json({ message: "Película añadida a la lista." });
};

exports.getMyLists = async (req, res) => {
  const lists = await Watchlist.find({ owner: req.user._id });
  res.json(lists);
};

exports.getFriendLists = async (req, res) => {
  const { username } = req.params;

  const friend = await User.findOne({ username });
  if (!friend) return res.status(404).json({ message: "Amigo no encontrado." });

  const isFriend = req.user.friends.includes(friend._id);
  if (!isFriend) return res.status(403).json({ message: "No puedes ver las listas de alguien que no es tu amigo." });

  const lists = await Watchlist.find({ owner: friend._id });
  res.json(lists);
};
