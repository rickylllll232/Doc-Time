const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Si process.env.MONGO_URI no existe, usa la cadena de texto directamente
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/doc-time');
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        // No salimos del proceso aquí para permitir que el log nos diga qué pasó
    }
};

module.exports = connectDB;