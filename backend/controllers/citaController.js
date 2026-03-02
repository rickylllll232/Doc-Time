const Cita = require('../models/Cita');

// Obtener todas las citas
exports.obtenerCitas = async (req, res) => {
    try {
        const citas = await Cita.find({ user: req.user.id });
        res.status(200).json({ success: true, data: citas });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Crear una nueva cita
exports.crearCita = async (req, res) => {
    try {
        req.body.user = req.user.id;
        const cita = await Cita.create(req.body);
        res.status(201).json({ success: true, data: cita });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

// Actualizar cita con PRECIO
exports.actualizarCita = async (req, res) => {
    try {
        const { nombre, fecha, motivo, precio } = req.body;
        const cita = await Cita.findByIdAndUpdate(
            req.params.id,
            { nombre, fecha, motivo, precio: Number(precio) },
            { new: true }
        );
        res.status(200).json({ success: true, data: cita });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Eliminar cita
exports.eliminarCita = async (req, res) => {
    try {
        await Cita.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};