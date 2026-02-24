// frontend/js/app.js

const API_URL = 'http://localhost:3000/api';

// --- LÓGICA DE LOGIN ---
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const errorMsg = document.getElementById('errorMessage');

        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            if (data.success) {
                localStorage.setItem('docTimeToken', data.token);
                localStorage.setItem('docTimeUser', JSON.stringify(data.user));
                window.location.href = 'dashboard.html';
            } else {
                errorMsg.textContent = data.message;
                errorMsg.style.display = 'block';
            }
        } catch (error) {
            console.error("Error en login:", error);
        }
    });
}

// --- LÓGICA DEL DASHBOARD ---
// Usamos ID para el botón y querySelector para el nombre
const logoutBtn = document.getElementById('logoutBtn'); 
const userNameDisplay = document.querySelector('.user-info span');

if (logoutBtn) {
    const token = localStorage.getItem('docTimeToken');
    const user = JSON.parse(localStorage.getItem('docTimeUser'));

    // Verificación de seguridad
    if (!token) {
        window.location.href = 'index.html';
    } else if (user && userNameDisplay) {
        userNameDisplay.innerHTML = `Hola, <strong>${user.nombre || 'Ricardo'}</strong>`;
    }

    // Evento de cerrar sesión
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('docTimeToken');
        localStorage.removeItem('docTimeUser');
        window.location.href = 'index.html';
    });
}

// Función para renderizar citas en la tabla
function renderCita(nombre, fecha, motivo) {
    const list = document.getElementById('appointmentsList');
    if (!list) return;

    // Limpiar mensajes iniciales
    if (list.innerHTML.includes('Cargando citas') || list.innerHTML.includes('Aún no hay citas')) {
        list.innerHTML = '';
    }

    const row = document.createElement('tr');
    row.innerHTML = `
        <td><strong>${nombre}</strong></td>
        <td>${new Date(fecha).toLocaleString()}</td>
        <td>${motivo}</td>
        <td><span class="status-badge">● Pendiente</span></td>
        <td><button class="btn-delete-row" style="padding:5px 10px; font-size:12px; background:#ff4d4d; color:white; border:none; border-radius:5px; cursor:pointer;">Eliminar</button></td>
    `;
    list.appendChild(row);
}

// LÓGICA PARA AGENDAR CITA
const apptForm = document.querySelector('.appointment-form'); 
const btnAdd = document.querySelector('.btn-add');

if (btnAdd && apptForm) {
    btnAdd.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Obtenemos los inputs por posición según tu HTML
        const inputs = apptForm.querySelectorAll('input');
        const name = inputs[0].value;
        const date = inputs[1].value;
        const reason = inputs[2].value;

        if (!name || !date) {
            alert("Por favor rellena el nombre y la fecha");
            return;
        }
        
        renderCita(name, date, reason);
        apptForm.reset();
        
        // Actualizar contador de tarjetas
        const totalDisplay = document.querySelector('.stat-card p');
        if (totalDisplay) {
            let currentTotal = parseInt(totalDisplay.textContent) || 0;
            totalDisplay.textContent = currentTotal + 1;
        }
    });
}