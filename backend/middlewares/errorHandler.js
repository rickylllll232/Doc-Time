const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    // Log para el desarrollador
    console.error(`[ERROR]: ${err.stack}`.red);

    // Mongoose bad ObjectId (ID no encontrado)
    if (err.name === 'CastError') {
        const message = `Recurso no encontrado. ID inválido: ${err.value}`;
        error = new Error(message);
        error.statusCode = 404;
    }

    // Mongoose clave duplicada (Ej. Email ya registrado)
    if (err.code === 11000) {
        const message = 'El valor ingresado ya existe en la base de datos (Duplicado)';
        error = new Error(message);
        error.statusCode = 400;
    }

    // Mongoose errores de validación 
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message).join(', ');
        error = new Error(message);
        error.statusCode = 400;
    }

    // Errores de JWT (Token alterado o expirado)
    if (err.name === 'JsonWebTokenError') {
        const message = 'Token inválido. Inicie sesión nuevamente.';
        error = new Error(message);
        error.statusCode = 401;
    }

    if (err.name === 'TokenExpiredError') {
        const message = 'Su sesión ha expirado. Inicie sesión nuevamente.';
        error = new Error(message);
        error.statusCode = 401;
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Error Interno del Servidor'
    });
};

module.exports = errorHandler;