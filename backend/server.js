require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db'); // Ajusta la ruta si tu server.js está fuera de la carpeta backend
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Conectar a MongoDB
connectDB();

// Middlewares globales
app.use(cors());
app.use(express.json()); 
app.use(express.static('frontend')); 

// 🔗 Rutas de la API
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/citas', require('./routes/citaRoutes')); // <-- ¡NUEVA RUTA DE CITAS AGREGADA!

// Middleware de errores (Siempre al final, después de las rutas)
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});