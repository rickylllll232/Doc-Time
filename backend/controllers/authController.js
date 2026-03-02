const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res, next) => {
    try {
        const { nombre, email, password, rol } = req.body;

        const existe = await User.findOne({ email });
        if (existe) return res.status(400).json({ success: false, message: 'El correo ya está registrado' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            nombre, 
            email, 
            password: hashedPassword, 
            rol: rol || 'doctor'
        });

        res.status(201).json({ success: true, message: 'Usuario creado exitosamente' });
    } catch (error) {
        next(error);
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        console.log(`\n--- Intento de Login: ${email} ---`);

        const user = await User.findOne({ email });
        if (!user) {
            console.log("❌ Error: Usuario no encontrado en la base de datos.");
            return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("❌ Error: La contraseña no coincide con el hash guardado.");
            return res.status(401).json({ success: false, message: 'Credenciales inválidas' });
        }

        console.log("✅ Login exitoso para:", user.nombre);

        // --- CAMBIO REALIZADO AQUÍ ---
        // Eliminamos process.env y ponemos la clave directamente entre comillas
        const token = jwt.sign(
            { id: user._id }, 
            'Clav3S3cr3ta_M3d1ca_2026!_Secure', 
            { expiresIn: '1d' }
        );
        // -----------------------------
        
        res.status(200).json({ 
            success: true, 
            token, 
            user: { nombre: user.nombre, rol: user.rol } 
        });
    } catch (error) {
        console.error("❌ Error en el servidor durante login:", error.message);
        next(error);
    }
};