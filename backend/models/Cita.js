const mongoose = require('mongoose');

const CitaSchema = new mongoose.Schema({
    // Nombre del paciente (obligatorio por validación)
    nombre: {
        type: String,
        required: [true, 'El nombre del paciente es obligatorio'],
        trim: true
    },
    // Fecha de la consulta
    fecha: {
        type: Date,
        required: [true, 'La fecha es obligatoria']
    },
    // Motivo de la visita
    motivo: {
        type: String,
        required: [true, 'El motivo es obligatorio']
    },
    // CAMBIO CLAVE: Agregamos el campo precio
    precio: {
        type: Number,
        default: 500 
    },
    // Referencia al usuario (Doctor) que crea la cita
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Cita', CitaSchema);