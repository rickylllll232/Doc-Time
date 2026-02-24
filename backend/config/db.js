// backend/config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`🏥 Doc-Time DB Conectada: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error de conexión DB: ${error.message}`);
        process.exit(1); // Detiene el servidor si la base de datos falla
    }
};

module.exports = connectDB;