const API_URL = 'https://doc-time.onrender.com/api';
// --- LÓGICA DE LOGIN ---
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const errorMsg = document.getElementById('errorMessage'); // Asegúrate de tener este ID en tu HTML o usa 'mensaje'

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
                // Si tienes un span con id="mensaje" en tu index.html
                const msgElement = errorMsg || document.getElementById('mensaje');
                if(msgElement) {
                    msgElement.textContent = data.message;
                    msgElement.style.display = 'block';
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
const token = localStorage.getItem('docTimeToken'); // Obtenemos el token para usarlo en las peticiones

if (logoutBtn) {
    const user = JSON.parse(localStorage.getItem('docTimeUser'));

    if (!token) {
        window.location.href = 'index.html'; // Protege la vista del dashboard
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
    
    let icono = 'fa-check-circle';
    if (tipo === 'error') icono = 'fa-triangle-exclamation';
    if (tipo === 'info') icono = 'fa-circle-info';

    toast.innerHTML = `<i class="fa-solid ${icono}"></i> <span>${mensaje}</span>`;
    contenedor.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// --- SISTEMA DE CITAS CON BASE DE DATOS (MOGODB) ---
let citas = []; // Ahora iniciará vacío y se llenará desde la BD
let idEnEdicion = null; // Guardará el _id de MongoDB

const apptForm = document.querySelector('.appointment-form'); 
const btnAdd = document.querySelector('.btn-add');
const list = document.getElementById('appointmentsList');
const totalDisplay = document.getElementById('totalCitas');

// 🟢 FUNCIÓN PARA OBTENER CITAS DESDE EL BACKEND
async function cargarCitas() {
    try {
        const response = await fetch(`${API_URL}/citas`); // LECTURA: No requiere token
        const result = await response.json();
        
        if (result.success) {
            citas = result.data;
            renderizarCitas();
        }
    } catch (error) {
        console.error("Error al cargar citas:", error);
        mostrarToast("No se pudieron cargar las citas", "error");
    }
}

function actualizarProximaCita() {
    const proximaCitaDisplay = document.getElementById('proximaCita');
    if (!proximaCitaDisplay) return;

    if (citas.length === 0) {
        proximaCitaDisplay.textContent = 'Sin citas';
        return;
    }

    const ahora = new Date();
    const citasFuturas = citas.filter(cita => new Date(cita.fecha) >= ahora);

    if (citasFuturas.length === 0) {
        proximaCitaDisplay.textContent = 'Sin citas próximas';
        return;
    }

    citasFuturas.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

    const proxima = citasFuturas[0]; 
    const fechaProxima = new Date(proxima.fecha);
    const hoy = new Date();
    const manana = new Date();
    manana.setDate(hoy.getDate() + 1);

    let textoFecha = '';
    if (fechaProxima.toDateString() === hoy.toDateString()) {
        textoFecha = 'Hoy';
    } else if (fechaProxima.toDateString() === manana.toDateString()) {
        textoFecha = 'Mañana';
    } else {
        textoFecha = fechaProxima.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
    }

    const textoHora = fechaProxima.toLocaleTimeString('es-ES', { hour: 'numeric', minute: '2-digit', hour12: true });
    proximaCitaDisplay.textContent = `${textoFecha}, ${textoHora}`;
}

function renderizarCitas() {
    if (!list) return;
    list.innerHTML = ''; 
    
    if (totalDisplay) totalDisplay.textContent = citas.length;
    actualizarProximaCita();

    if (citas.length === 0) {
        list.innerHTML = `
            <tr>
                <td colspan="5" style="text-align: center; color: #aaa; padding: 30px;">
                    <i class="fa-solid fa-folder-open" style="font-size: 2rem; margin-bottom: 10px; display: block;"></i>
                    Aún no hay citas registradas.
                </td>
            </tr>
        `;
        return;
    }

    citas.forEach((cita, index) => {
        const row = document.createElement('tr');
        const fechaObj = new Date(cita.fecha);
        const fechaFormateada = fechaObj.toLocaleDateString() + ' ' + fechaObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

        // Usamos el _id de MongoDB para identificar la cita
        row.innerHTML = `
            <td><strong>${cita.nombre}</strong></td>
            <td>${fechaFormateada}</td>
            <td>${cita.motivo}</td>
            <td><span class="status-badge"><i class="fa-solid fa-circle-dot" style="font-size:0.6rem; margin-right:4px;"></i> ${cita.estado || 'Pendiente'}</span></td>
            <td>
                <button class="btn-edit-row" onclick="editarCita(${index})" title="Editar cita"><i class="fa-solid fa-pen"></i></button>
                <button class="btn-delete-row" onclick="eliminarCita('${cita._id}')" title="Eliminar cita"><i class="fa-solid fa-trash-can"></i></button>
            </td>
        `;
        list.appendChild(row);
    });
}

// 🔴 FUNCIÓN PARA ELIMINAR CITA EN EL BACKEND (Protegida)
window.eliminarCita = async function(id) {
    if (confirm(`¿Estás seguro de que deseas eliminar esta cita?`)) {
        try {
            const response = await fetch(`${API_URL}/citas/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}` // Enviamos el Gafete (Token)
                }
            });
            const result = await response.json();

            if (result.success) {
                mostrarToast('Cita eliminada correctamente', 'info'); 
                cargarCitas(); // Recargamos la lista desde la BD
            } else {
                mostrarToast(result.message || 'Error al eliminar', 'error');
            }
        } catch (error) {
            console.error(error);
            mostrarToast('Error de conexión', 'error');
        }
    }
};

window.editarCita = function(index) {
    const inputs = apptForm.querySelectorAll('input');
    const cita = citas[index];

    inputs[0].value = cita.nombre;
    // Formatear la fecha para el input datetime-local (YYYY-MM-DDTHH:mm)
    const fechaFormat = new Date(cita.fecha).toISOString().slice(0, 16);
    inputs[1].value = fechaFormat;
    inputs[2].value = cita.motivo;

    idEnEdicion = cita._id; // Guardamos el ID real de la base de datos
    
    btnAdd.innerHTML = '<i class="fa-solid fa-save"></i> Guardar Cambios';
    btnAdd.style.backgroundColor = '#0A74DA';
};

// 🔴 FUNCIÓN PARA CREAR O ACTUALIZAR CITA EN EL BACKEND (Protegida)
if (btnAdd && apptForm) {
    btnAdd.addEventListener('click', async (e) => {
        e.preventDefault();
        
        const inputs = apptForm.querySelectorAll('input');
        const nombre = inputs[0].value;
        const fecha = inputs[1].value;
        const motivo = inputs[2].value;

        if (!nombre || !fecha || !motivo) {
            mostrarToast('Por favor rellena todos los campos', 'error'); 
            return;
        }

        const datosCita = { nombre, fecha, motivo };

        try {
            let url = `${API_URL}/citas`;
            let method = 'POST';

            if (idEnEdicion) {
                url = `${API_URL}/citas/${idEnEdicion}`;
                method = 'PUT';
            }

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Gafete de seguridad
                },
                body: JSON.stringify(datosCita)
            });

            const result = await response.json();

            if (result.success) {
                mostrarToast(idEnEdicion ? 'Cita actualizada correctamente' : 'Cita agendada con éxito', 'success'); 
                
                idEnEdicion = null; 
                btnAdd.innerHTML = '<i class="fa-solid fa-calendar-plus"></i> Agendar Cita';
                btnAdd.style.backgroundColor = '#20c997';
                apptForm.reset(); 
                
                cargarCitas(); // Recargar la lista
            } else {
                mostrarToast(result.message || 'Error al guardar la cita', 'error');
            }
        } catch (error) {
            console.error(error);
            mostrarToast('Error de conexión al guardar', 'error');
        }
    });
    
    // Cargar las citas apenas inicie el dashboard
    cargarCitas();
}