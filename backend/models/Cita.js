const mongoose = require('mongoose');

const CitaSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre del paciente es obligatorio']
    },
    fecha: {
        type: Date,
        required: [true, 'La fecha y hora son obligatorias']
    },
    motivo: {
        type: String,
        required: [true, 'El motivo de la cita es obligatorio']
    },
    estado: {
        type: String,
        default: 'Pendiente',
        enum: ['Pendiente', 'Completada', 'Cancelada'] // Opciones válidas
    },
    // Opcional: Para saber qué doctor/usuario creó la cita
    usuario: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: false 
    }
}, { timestamps: true }); // timestamps crea automáticamente 'createdAt' y 'updatedAt'

module.exports = mongoose.model('Cita', CitaSchema);