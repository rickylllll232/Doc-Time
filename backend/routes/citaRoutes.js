const express = require('express');
const {
    obtenerCitas,
    crearCita,
    actualizarCita,
    eliminarCita
} = require('../controllers/citaController');

// Importamos nuestro middleware de protección
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Rutas para /api/citas
router.route('/')
    .get(obtenerCitas)           // 🟢 LECTURA: Abierta (cualquiera puede verlas)
    .post(protect, crearCita);   // 🔴 CREACIÓN: Protegida (requiere token)

// Rutas para /api/citas/:id
router.route('/:id')
    .put(protect, actualizarCita)    // 🔴 ACTUALIZACIÓN: Protegida
    .delete(protect, eliminarCita);  // 🔴 ELIMINACIÓN: Protegida

module.exports = router;