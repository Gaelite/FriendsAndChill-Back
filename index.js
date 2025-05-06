// 1. Requiere los módulos necesarios
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); // Requiere Mongoose
require('dotenv').config();

// 2. Inicializa la app de Express
const app = express();
const PORT = process.env.PORT || 3000;

// 3. Requiere tus rutas y middleware
const userRoutes = require('./routes/userRoutes');

// 4. Middleware global
app.use(cors());               // Para permitir CORS
app.use(express.json());       // Para parsear JSON en body

// 5. Conexión a MongoDB sin opciones deprecated
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Conexión a MongoDB exitosa')) // Si se conecta correctamente
  .catch((err) => console.error('Error al conectar a MongoDB:', err)); // Si ocurre un error

// 6. Rutas protegidas (requieren autenticación)
app.use('/api/users', userRoutes);

// 7. Inicia el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
