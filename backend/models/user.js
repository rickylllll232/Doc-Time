const mongoose = require('mongoose');

// Definimos la estructura de cómo se verá un usuario en la base de datos
const UserSchema = new mongoose.Schema({
    nombre: { 
        type: String, 
        required: [true, 'El nombre es obligatorio'] 
    },
    email: { 
        type: String, 
        required: [true, 'El correo es obligatorio'], 
        unique: true, // No permite correos duplicados
        lowercase: true 
    },
    password: { 
        type: String, 
        required: [true, 'La contraseña es obligatoria'] 
    },
    rol: { 
        type: String, 
        enum: ['paciente', 'doctor'], 
        default: 'paciente' 
    },
    fechaCreacion: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('User', UserSchema);