const Cita = require('../models/Cita');

// @desc    Obtener todas las citas
// @route   GET /api/citas
exports.obtenerCitas = async (req, res, next) => {
    try {
        // Busca todas las citas y las ordena por fecha (de la más próxima a la más lejana)
        const citas = await Cita.find().sort({ fecha: 1 });
        res.status(200).json({ success: true, count: citas.length, data: citas });
    } catch (error) {
        next(error);
    }
};

// @desc    Crear una nueva cita
// @route   POST /api/citas
exports.crearCita = async (req, res, next) => {
    try {
        const { nombre, fecha, motivo } = req.body;
        const nuevaCita = await Cita.create({ nombre, fecha, motivo });
        
        res.status(201).json({ success: true, data: nuevaCita });
    } catch (error) {
        next(error);
    }
};

// @desc    Actualizar una cita existente
// @route   PUT /api/citas/:id
exports.actualizarCita = async (req, res, next) => {
    try {
        const cita = await Cita.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // Devuelve el documento actualizado
            runValidators: true // Verifica que cumpla las reglas del modelo
        });

        if (!cita) {
            return res.status(404).json({ success: false, message: 'Cita no encontrada' });
        }

        res.status(200).json({ success: true, data: cita });
    } catch (error) {
        next(error);
    }
};

// @desc    Eliminar una cita
// @route   DELETE /api/citas/:id
exports.eliminarCita = async (req, res, next) => {
    try {
        const cita = await Cita.findByIdAndDelete(req.params.id);

        if (!cita) {
            return res.status(404).json({ success: false, message: 'Cita no encontrada' });
        }

        res.status(200).json({ success: true, message: 'Cita eliminada correctamente' });
    } catch (error) {
        next(error);
    }
};