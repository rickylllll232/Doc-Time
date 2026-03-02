require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const errorHandler = require('./middlewares/errorHandler'); 

const app = express();
app.use(cors());

// --- CONFIGURACIÓN DE BASE DE DATOS ---
const dbURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/doc-time';

const connectDB = async () => {
    try {
        await mongoose.connect(dbURI);
        console.log('✅ MongoDB Conectado con éxito');
    } catch (err) {
        console.error('❌ Error crítico de conexión DB:', err.message);
        // Opcional: process.exit(1); // Detener el servidor si la DB es vital
    }
};

connectDB();

// --- MIDDLEWARES GLOBALES ---
app.use(cors({ origin: '*' }));
app.use(express.json()); 

// app.use(express.static('public')); 

// --- RUTAS DE LA API ---
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/citas', require('./routes/citaRoutes')); 
app.use('/api/finanzas', require('./routes/finanzasRoutes'));

// --- MANEJO DE ERRORES ---
// Debe ir después de todas las rutas
app.use(errorHandler);

// --- ENCENDIDO DEL SERVIDOR ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor listo en el puerto ${PORT}`);
});