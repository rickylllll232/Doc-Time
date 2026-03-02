const API_URL = 'https://doc-time.onrender.com/api';

// --- LÓGICA DE LOGIN ---
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const errorMsg = document.getElementById('errorMessage') || document.getElementById('mensaje');

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
                if(errorMsg) {
                    errorMsg.textContent = data.message;
                    errorMsg.style.display = 'block';
                }
            }
        } catch (error) {
            console.error("Error en login:", error);
        }
    });
}

// --- LÓGICA DEL DASHBOARD ---
const logoutBtn = document.getElementById('logoutBtn'); 
const userNameDisplay = document.querySelector('.user-info span.user-greeting');
const token = localStorage.getItem('docTimeToken'); 

if (logoutBtn) {
    const user = JSON.parse(localStorage.getItem('docTimeUser'));

    if (!token) {
        window.location.href = 'index.html'; 
    } else if (user && userNameDisplay) {
        userNameDisplay.innerHTML = `Hola, <strong>${user.nombre || 'Doctor'}</strong>`;
    }

    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('docTimeToken');
        localStorage.removeItem('docTimeUser');
        window.location.href = 'index.html';
    });
}

// --- SISTEMA DE NOTIFICACIONES (TOASTS) ---
function mostrarToast(mensaje, tipo = 'success') {
    const contenedor = document.getElementById('toast-container');
    if (!contenedor) return;

    const toast = document.createElement('div');
    toast.className = `toast ${tipo}`;
    let icono = tipo === 'error' ? 'fa-triangle-exclamation' : (tipo === 'info' ? 'fa-circle-info' : 'fa-check-circle');

    toast.innerHTML = `<i class="fa-solid ${icono}"></i> <span>${mensaje}</span>`;
    contenedor.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// --- SISTEMA DE CITAS ---
let citas = []; 
let idEnEdicion = null; 

const apptForm = document.getElementById('formCita'); 
const btnAdd = document.querySelector('.btn-add');
const list = document.getElementById('appointmentsList');
const totalDisplay = document.getElementById('totalCitas');

async function cargarCitas() {
    try {
        const response = await fetch(`${API_URL}/citas`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const result = await response.json();
        if (result.success) {
            citas = result.data;
            renderizarCitas();
        }
    } catch (error) {
        console.error("Error al cargar citas:", error);
    }
}

function renderizarCitas() {
    if (!list) return;
    list.innerHTML = ''; 
    if (totalDisplay) totalDisplay.textContent = citas.length;

    if (citas.length === 0) {
        list.innerHTML = `<tr><td colspan="6" style="text-align: center; color: #aaa; padding: 30px;">Aún no hay citas registradas.</td></tr>`;
        return;
    }

    citas.forEach((cita, index) => {
        const row = document.createElement('tr');
        const fechaObj = new Date(cita.fecha);
        const fechaFormateada = fechaObj.toLocaleDateString() + ' ' + fechaObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

        row.innerHTML = `
            <td><strong>${cita.nombre}</strong></td>
            <td>${fechaFormateada}</td>
            <td>${cita.motivo}</td>
            <td>$${cita.precio || 0}</td>
            <td><span class="status-badge">${cita.estado || 'Pendiente'}</span></td>
            <td>
                <button class="btn-edit-row" onclick="editarCita(${index})"><i class="fa-solid fa-pen"></i></button>
                <button class="btn-delete-row" onclick="eliminarCita('${cita._id}')"><i class="fa-solid fa-trash-can"></i></button>
            </td>
        `;
        list.appendChild(row);
    });
}

// ELIMINAR CITA
window.eliminarCita = async function(id) {
    if (confirm(`¿Eliminar esta cita?`)) {
        try {
            const response = await fetch(`${API_URL}/citas/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if ((await response.json()).success) {
                mostrarToast('Cita eliminada', 'info'); 
                cargarCitas();
            }
        } catch (error) { mostrarToast('Error de conexión', 'error'); }
    }
};

// EDITAR CITA (Prepara el formulario)
window.editarCita = function(index) {
    const cita = citas[index];
    document.getElementById('paciente').value = cita.nombre;
    document.getElementById('fecha').value = new Date(cita.fecha).toISOString().slice(0, 16);
    document.getElementById('motivo').value = cita.motivo;
    document.getElementById('precio').value = cita.precio || '';

    idEnEdicion = cita._id; 
    btnAdd.innerHTML = '<i class="fa-solid fa-save"></i> Guardar Cambios';
    btnAdd.style.backgroundColor = '#0A74DA';
};

// CREAR O ACTUALIZAR CITA
if (btnAdd && apptForm) {
    btnAdd.addEventListener('click', async (e) => {
        e.preventDefault();
        
        const nombre = document.getElementById('paciente').value;
        const fecha = document.getElementById('fecha').value;
        const motivo = document.getElementById('motivo').value;
        const precio = document.getElementById('precio').value;

        if (!nombre || !fecha || !motivo) {
            mostrarToast('Faltan campos obligatorios', 'error'); 
            return;
        }

        const datosCita = { nombre, fecha, motivo, precio };

        try {
            const url = idEnEdicion ? `${API_URL}/citas/${idEnEdicion}` : `${API_URL}/citas`;
            const method = idEnEdicion ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(datosCita)
            });

            const result = await response.json();
            if (result.success) {
                mostrarToast(idEnEdicion ? 'Cita actualizada' : '✅ Cita agendada', 'success'); 
                idEnEdicion = null; 
                btnAdd.innerHTML = '<i class="fa-solid fa-calendar-plus"></i> Agendar Cita';
                btnAdd.style.backgroundColor = '#20c997';
                apptForm.reset(); 
                cargarCitas();
            } else {
                mostrarToast(result.message, 'error');
            }
        } catch (error) { mostrarToast('Error de conexión', 'error'); }
    });
    
    cargarCitas();
}