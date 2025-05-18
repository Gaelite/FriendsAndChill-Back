const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Verificar si ya existe un usuario con ese email o username
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        message: existingUser.email === email
          ? 'El email ya está registrado.'
          : 'El nombre de usuario ya está en uso.'
      });
    }

    // Crear usuario
    const newUser = new User({ username, email, password });
    await newUser.save();

    res.status(201).json({ message: 'Usuario creado con éxito.' });

  } catch (err) {
    res.status(500).json({ message: 'Error al crear usuario.', error: err.message });
  }
};

exports.searchUser = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username }, '-password'); // Excluir contraseña

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error del servidor', error: err.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Intentando login para:", email);

    const user = await User.findOne({ email });
    if (!user) {
      console.log("Usuario no encontrado");
      return res.status(400).json({ error: 'Usuario no encontrado' });
    }

    console.log("Usuario encontrado:", user.email);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log("Contraseña incorrecta");
      return res.status(400).json({ error: 'Contraseña incorrecta' });
    }

    // En lugar de generar un token nuevo, devuelve el existente
    console.log("Token existente:", user.token);
    return res.status(200).json({ username: user.username , token: user.token });
    
  } catch (err) {
    console.error("Error de login:", err);
    return res.status(500).json({ error: 'Error en el inicio de sesión', erra: err.message });
  }
};

exports.getUsers = async (req, res) => {
  const users = await User.find({}, '-token'); // excluye el campo "token"
  res.json(users);
};

// ------------------------------------------- Friends Logic -----------------------------------------

// Formato común para los JSON:
// Para enviar solicitudes, aceptar o rechazar, en el body se enviará:
// {
  //   "username": "nombreUsuarioDestino"
  // }
  // El usuario autenticado se obtiene de req.user
  
exports.getFriends = async (req, res) => {
  try {
    // Cargar usuario con población de amigos (trae datos completos)
    const user = await User.findById(req.user._id).populate('friends', 'username email');
    if (!user) return res.status(404).json({ message: "Usuario no encontrado." });

    res.json({ friends: user.friends });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener amigos.", error: error.message });
  }
};

exports.getFriendRequestsReceived = async (req, res) => {
  try {
    // Cargar usuario con población de solicitudes recibidas
    const user = await User.findById(req.user._id).populate('friendRequestsReceived', 'username email');
    if (!user) return res.status(404).json({ message: "Usuario no encontrado." });

    res.json({ friendRequestsReceived: user.friendRequestsReceived });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener solicitudes recibidas.", error: error.message });
  }
};


// 📤 Enviar solicitud de amistad
exports.sendFriendRequest = async (req, res) => {
  const { username } = req.body;
  const fromUser = req.user; // usuario autenticado, viene del middleware
  if (fromUser.username === username)
    return res.status(400).json({ message: "No puedes agregarte a ti mismo." });

  const toUser = await User.findOne({ username });
  if (!toUser) return res.status(404).json({ message: "Usuario receptor no encontrado." });

  if (fromUser.friends.includes(toUser._id))
    return res.status(400).json({ message: "Ya son amigos." });

  if (fromUser.friendRequestsSent.includes(toUser._id))
    return res.status(400).json({ message: "Solicitud ya enviada." });

  fromUser.friendRequestsSent.push(toUser._id);
  toUser.friendRequestsReceived.push(fromUser._id);

  await fromUser.save();
  await toUser.save();

  res.json({ message: `Solicitud de amistad enviada a ${username}.` });
};

// ✅ Aceptar solicitud de amistad
exports.acceptFriendRequest = async (req, res) => {
  const currentUser = req.user;  // Usuario autenticado desde el token
  const { username } = req.body;

  if (currentUser.username === username) 
    return res.status(400).json({ message: "No puedes aceptar tu propia solicitud." });

  const requester = await User.findOne({ username });
  if (!requester) return res.status(404).json({ message: "Usuario solicitante no encontrado." });

  if (!currentUser.friendRequestsReceived.includes(requester._id)) {
    return res.status(400).json({ message: "No tienes solicitud de este usuario." });
  }

  // Remover solicitud
  currentUser.friendRequestsReceived = currentUser.friendRequestsReceived.filter(
    id => id.toString() !== requester._id.toString()
  );
  requester.friendRequestsSent = requester.friendRequestsSent.filter(
    id => id.toString() !== currentUser._id.toString()
  );

  // Agregar como amigos
  if (!currentUser.friends.includes(requester._id)) currentUser.friends.push(requester._id);
  if (!requester.friends.includes(currentUser._id)) requester.friends.push(currentUser._id);

  await currentUser.save();
  await requester.save();

  res.json({ message: `Solicitud de amistad de ${username} aceptada.` });
};

// ❌ Rechazar solicitud de amistad
exports.rejectFriendRequest = async (req, res) => {
  const currentUser = req.user;  // Usuario autenticado desde el token
  const { username } = req.body;

  if (currentUser.username === username) 
    return res.status(400).json({ message: "No puedes rechazar tu propia solicitud." });

  const requester = await User.findOne({ username });
  if (!requester) return res.status(404).json({ message: "Usuario solicitante no encontrado." });

  if (!currentUser.friendRequestsReceived.includes(requester._id)) {
    return res.status(400).json({ message: "No tienes solicitud de este usuario." });
  }

  // Remover solicitud sin agregar amigos
  currentUser.friendRequestsReceived = currentUser.friendRequestsReceived.filter(
    id => id.toString() !== requester._id.toString()
  );
  requester.friendRequestsSent = requester.friendRequestsSent.filter(
    id => id.toString() !== currentUser._id.toString()
  );

  await currentUser.save();
  await requester.save();

  res.json({ message: `Solicitud de amistad de ${username} rechazada.` });
};

