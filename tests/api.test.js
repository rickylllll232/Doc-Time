const request = require('supertest');
const express = require('express');

// Simulamos tu servidor de Express para las pruebas
const app = express();
app.use(express.json());

// Importamos tus rutas reales
app.use('/api/finanzas', require('../backend/routes/finanzasRoutes'));
app.use('/api/citas', require('../backend/routes/citaRoutes'));

describe('Pruebas de la API de Doc-Time', () => {

    // Prueba 1: Funcionalidad de API externa
    it('Debe devolver el precio de la consulta en diferentes monedas (Status 200)', async () => {
        const res = await request(app).get('/api/finanzas/precio-consulta');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('success', true);
        expect(res.body.precios).toHaveProperty('USD');
    });

    // Prueba 2: Prueba de Seguridad (Ruta protegida)
    it('Debe denegar la creación de una cita si no hay Token JWT (Status 401)', async () => {
        const res = await request(app)
            .post('/api/citas')
            .send({
                nombre: 'Paciente Hacker',
                fecha: '2026-03-01',
                motivo: 'Dolor de cabeza'
            }); // Intentamos enviar datos SIN token de autorización
        
        expect(res.statusCode).toEqual(401);
        expect(res.body.error).toMatch(/No autorizado/i);
    });

});