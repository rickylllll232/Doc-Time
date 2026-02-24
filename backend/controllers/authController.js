// backend/controllers/authController.js
const User = require('../models/User'); // Importamos el modelo que creaste antes
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Función para registrar un nuevo usuario
exports.register = async (req, res, next) => {
    try {
        const { nombre, email, password, rol } = req.body;

        // Encriptar la contraseña por seguridad
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Crear el usuario
        const user = await User.create({
            nombre, email, password: hashedPassword, rol
        });

        res.status(201).json({ success: true, message: 'Usuario creado exitosamente' });
    } catch (error) {
        next(error); // Pasa el error a tu middleware
    }
};

// Función para iniciar sesión
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Buscar al usuario por su email
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ success: false, message: 'Credenciales inválidas' });

        // Comparar la contraseña ingresada con la encriptada
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ success: false, message: 'Credenciales inválidas' });

        // Generar el Token (JWT)
        const token = jwt.sign({ id: user._id, rol: user.rol }, process.env.JWT_SECRET, {
            expiresIn: '1d' // El token dura 1 día
        });

        res.status(200).json({ success: true, token, user: { nombre: user.nombre, rol: user.rol } });
    } catch (error) {
        next(error);
    }
};