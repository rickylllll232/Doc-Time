exports.obtenerPrecioConsulta = async (req, res, next) => {
    try {
        // 1. Definimos el costo base de la cita en Pesos Mexicanos (MXN)
        const costoBaseMXN = 500; 

        // 2. Nos conectamos a la API Externa para pedir los tipos de cambio al día de hoy
        const response = await fetch('https://open.er-api.com/v6/latest/MXN');
        
        if (!response.ok) {
            throw new Error('Error al conectar con la API de finanzas externa');
        }

        const data = await response.json();

        // 3. Calculamos los precios usando los datos reales que nos dio la API
        const costoUSD = (costoBaseMXN * data.rates.USD).toFixed(2); // Convertir a Dólares
        const costoEUR = (costoBaseMXN * data.rates.EUR).toFixed(2); // Convertir a Euros

        // 4. Enviamos la respuesta al Frontend
        res.status(200).json({
            success: true,
            mensaje: "Precios de consulta actualizados en tiempo real",
            precios: {
                MXN: costoBaseMXN,
                USD: parseFloat(costoUSD),
                EUR: parseFloat(costoEUR)
            },
            ultima_actualizacion: data.time_last_update_utc
        });

    } catch (error) {
        next(error);
    }
};