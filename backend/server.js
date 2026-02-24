require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db'); // Importamos la conexión a la BD
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Conectar a MongoDB
connectDB();

// Middlewares globales
app.use(cors());
app.use(express.json()); 
app.use(express.static('frontend')); 

// 🔗 Rutas de la API (AQUÍ CONECTAMOS EL LOGIN/REGISTRO)
app.use('/api/auth', require('./routes/authRoutes'));

// Middleware de errores (Siempre al final)
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});

