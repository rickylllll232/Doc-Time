const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Middleware 1: Verificar si hay Token (Autenticación)
exports.protect = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ success: false, error: 'No autorizado para acceder a esta ruta' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        
        if (!req.user) {
            return res.status(401).json({ success: false, error: 'El usuario ya no existe' });
        }
        
        next();
    } catch (error) {
        res.status(401).json({ success: false, error: 'Token no válido o expirado' });
    }
};

// Middleware 2: Verificar Rol
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.rol)) {
            return res.status(403).json({ 
                success: false, 
                error: `El rol '${req.user.rol}' no tiene permisos` 
            });
        }
        next();
    };
};