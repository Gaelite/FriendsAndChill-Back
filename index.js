const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const userRoutes = require('./routes/userRoutes');
const authMiddleware = require('./middleware/authMiddleware');

// Middleware
app.use(cors());
app.use(express.json());

// Rutas protegidas
app.use('/api/users', authMiddleware, userRoutes);

// Servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
