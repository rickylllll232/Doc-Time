const express = require('express');
const { obtenerPrecioConsulta } = require('../controllers/finanzasController');

const router = express.Router();

// Ruta: GET /api/finanzas/precio-consulta
router.get('/precio-consulta', obtenerPrecioConsulta);

module.exports = router;