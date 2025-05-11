const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    // Verifica si ya existe el usuario
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'El usuario ya existe' });
    }

    // Crea el nuevo usuario
    const newUser = new User({ username, email, password: hashedPassword });

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

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET // <-- revisa que no sea undefined
    );

    console.log("Token generado:", token);
    return res.status(200).json({ token });
  } catch (err) {
    console.error("Error de login:", err);
    return res.status(500).json({ error: 'Error en el inicio de sesión', erra: err.message });
  }
};


exports.getUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};
