const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Ajusta la ruta a tu modelo de Usuario

exports.protect = async (req, res, next) => {
    let token;

    // Verificar si el token viene en los headers bajo "Authorization" (Bearer token...)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]; // Extraer solo el token, quitando la palabra "Bearer"
    }

    // Si no hay token, el usuario no está logueado
    if (!token) {
        return res.status(401).json({ success: false, message: 'No estás autorizado para acceder a esta ruta' });
    }

    try {
        // Verificar el token con la palabra secreta
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Buscar al usuario en la BD con el ID que venía dentro del token y guardarlo en 'req.user'
        req.user = await User.findById(decoded.id).select('-password'); // Excluimos la contraseña por seguridad

        next(); // Todo está bien, pasa a la siguiente función (crear/editar/borrar)
    } catch (error) {
        return res.status(401).json({ success: false, message: 'Token inválido o expirado' });
    }
};