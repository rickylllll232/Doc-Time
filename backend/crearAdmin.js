const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/user'); 

const DB_URI = 'mongodb+srv://Doctor:Ostias69@doc-time.erauiaf.mongodb.net/doc-time?retryWrites=true&w=majority';

const inyectarUsuario = async () => {
    try {
        await mongoose.connect(DB_URI);
        console.log('✅ Conectado a la Base de Datos Local...');

        // Borramos al usuario si existe para no tener duplicados
        await User.deleteOne({ email: 'ricardo@doctime.com' });

        // Encriptamos la contraseña "DocTime2026!"
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('DocTime2026!', salt);

        // Creamos al usuario
        await User.create({
            nombre: 'Ricardo Vallebueno',
            email: 'ricardo@doctime.com',
            password: hashedPassword,
            rol: 'doctor' 
        });

        console.log('🎉 ¡Éxito! Usuario ricardo@doctime.com creado. Contraseña: DocTime2026!');
        process.exit(0); 
    } catch (error) {
        console.error('❌ Error al crear usuario:', error);
        process.exit(1);
    }
};

inyectarUsuario();