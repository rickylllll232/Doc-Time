const express = require('express');
const router = express.Router();
const { 
    obtenerCitas, 
    crearCita, 
    actualizarCita, 
    eliminarCita 
} = require('../controllers/citaController');
 
const { protect } = require('../middlewares/authMiddlewares');

router.use(protect);

router.route('/')
    .get(obtenerCitas)
    .post(crearCita);

router.route('/:id')
    .put(actualizarCita)
    .delete(eliminarCita);

module.exports = router;