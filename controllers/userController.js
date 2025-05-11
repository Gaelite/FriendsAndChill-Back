const User = require('../models/userModel');
const jwt = require('jsonwebtoken');

exports.createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Verifica si ya existe el usuario
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'El usuario ya existe' });
    }

    // Crea el nuevo usuario
    const newUser = new User({ username, email, password });

    // Genera el token solo una vez
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email },
      process.env.JWT_SECRET
      // sin expiresIn para que no expire
    );
    newUser.token = token;

    await newUser.save();

    res.status(201).json({ user: newUser });
  } catch (err) {
    res.status(400).json({ error: 'Error al crear usuario' });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  res.status(200).json({ user });
};

exports.getUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};