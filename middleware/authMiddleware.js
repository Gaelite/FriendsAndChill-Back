//   Función que se ejecuta antes de llegar al controlador, por ejemplo para autenticar usuarios.
const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization;
    if (token === '1234') {
      next(); // acceso permitido
    } else {
      res.status(401).json({ message: 'No autorizado' });
    }
  };
  
  module.exports = authMiddleware;
