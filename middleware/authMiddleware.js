const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token no proporcionado' });
    }

    const token = authHeader.split(' ')[1];

    // Verifica la firma del token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Busca el usuario y asegura que el token coincida con el de la BD
    const user = await User.findById(decoded.id);

    if (!user || user.token !== token) {
      return res.status(401).json({ error: 'Token inválido' });
    }

    // Adjunta el usuario a la request para uso posterior
    req.user = user;
    next();

  } catch (err) {
    return res.status(401).json({ error: 'Acceso no autorizado' });
  }
};
