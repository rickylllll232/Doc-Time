// Middleware personalizado para manejo de errores
const errorHandler = (err, req, res, next) => {
    // Determinar el código de estado (por defecto 500 si no existe)
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    
    res.status(statusCode).json({
        success: false,
        message: err.message || 'Error interno del servidor',
        // Mostrar el "stack trace" solo si estamos en desarrollo para mayor seguridad
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

module.exports = errorHandler;