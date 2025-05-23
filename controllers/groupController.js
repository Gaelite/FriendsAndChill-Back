const Group = require('../models/groupModel');
const User = require('../models/userModel');

exports.addMemberToGroup = async (req, res) => {
  const userId = req.user._id;
  const { groupId } = req.params;
  const { friendUsername } = req.body;

  try {
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Grupo no encontrado" });

    const friend = await User.findOne({ username: friendUsername });
    if (!friend) return res.status(404).json({ message: "Usuario no encontrado" });

    const currentUser = await User.findById(userId);
    const isFriend = currentUser.friends.includes(friend._id);

    if (!isFriend) return res.status(403).json({ message: "Solo puedes agregar amigos al grupo" });

    if (group.members.includes(friend._id))
      return res.status(400).json({ message: "Ese usuario ya está en el grupo" });

    group.members.push(friend._id);
    await group.save();

    res.json({ message: `Usuario ${friend.username} agregado al grupo.`, group });
  } catch (error) {
    res.status(500).json({ message: "Error al agregar miembro", error: error.message });
  }
};
// Crear nuevo grupo
exports.createGroup = async (req, res) => {
  try {
    const { name } = req.body;
    const creatorId = req.user._id;
    const group = new Group({ name, members: [creatorId] });
    await group.save();
    res.status(201).json(group);
  } catch (error) {
    res.status(500).json({ message: "Error al crear grupo", error: error.message });
  }
};

// Ver grupos donde el usuario está
exports.getUserGroups = async (req, res) => {
  try {
    const groups = await Group.find({ members: req.user._id }).populate('members', 'username');
    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener grupos", error: error.message });
  }
};

// Agregar película a un grupo
exports.addMovieToGroup = async (req, res) => {
  const { groupId } = req.params;
  const { tmdbId, title } = req.body;
  try {
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Grupo no encontrado" });
    if (!group.members.includes(req.user._id))
      return res.status(403).json({ message: "No eres miembro del grupo" });

    const exists = group.movies.some(movie => movie.tmdbId === tmdbId);
    if (exists)
      return res.status(400).json({ message: "La película ya está en el grupo" });

    group.movies.push({ tmdbId, title, addedBy: req.user._id });
    await group.save();
    res.status(201).json({ message: "Película agregada", movie: { tmdbId, title } });
  } catch (error) {
    res.status(500).json({ message: "Error al agregar película", error: error.message });
  }
};

// Ver películas de un grupo
exports.getGroupMovies = async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId).populate('movies.addedBy', 'username');
    if (!group) return res.status(404).json({ message: "Grupo no encontrado" });
    if (!group.members.includes(req.user._id))
      return res.status(403).json({ message: "No eres miembro del grupo" });

    res.json(group.movies);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener películas", error: error.message });
  }
};

// Eliminar película del grupo
exports.deleteMovieFromGroup = async (req, res) => {
  try {
    const { groupId, tmdbId } = req.params;
    const group = await Group.findById(groupId);
    if (!group) return res.status(404).json({ message: "Grupo no encontrado" });
    if (!group.members.includes(req.user._id))
      return res.status(403).json({ message: "No eres miembro del grupo" });

    group.movies = group.movies.filter(m => m.tmdbId !== tmdbId);
    await group.save();
    res.json({ message: "Película eliminada" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar película", error: error.message });
  }
};
