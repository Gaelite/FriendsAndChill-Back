// 1. Requiere los módulos necesarios
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); // Requiere Mongoose
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

require('dotenv').config();

// 2. Inicializa la app de Express
const app = express();
const PORT = process.env.PORT || 3000;

// 3. Requiere tus rutas y middleware
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument)); //http://localhost:3000/api-docs para ver swagger

const userRoutes = require('./routes/userRoutes');
const emotionRoutes = require('./routes/emotionRoutes');
const groupRoutes = require('./routes/groupRoutes');

// 4. Middleware global
app.use(cors());               // Para permitir CORS
app.use(express.json());       // Para parsear JSON en body

// 5. Conexión a MongoDB sin opciones deprecated
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('Conexión a MongoDB exitosa')) // Si se conecta correctamente
.catch((err) => console.error('Error al conectar a MongoDB:', err)); // Si ocurre un error

// 6. Rutas protegidas (requieren autenticación)
app.use('/api/users', userRoutes);
app.use('/api/emotion', emotionRoutes);
app.use('/api/groups', groupRoutes);

// 7. Inicia el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
