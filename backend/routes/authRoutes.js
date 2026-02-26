const express = require('express');
const { register, login } = require('../controllers/authController'); // Asegúrate de que el nombre del archivo coincida

const router = express.Router();

// Ruta para registrar un usuario: POST /api/auth/register
router.post('/register', register);

// Ruta para iniciar sesión: POST /api/auth/login
router.post('/login', login);

module.exports = router;