import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [citas, setCitas] = useState([]);
  const [nombre, setNombre] = useState('');
  const [fecha, setFecha] = useState('');
  const [motivo, setMotivo] = useState('');
  const [precio, setPrecio] = useState(500);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [citaId, setCitaId] = useState(null);
  const navigate = useNavigate();

  const cargarCitas = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:3000/api/citas', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = response.data.data || response.data.citas || response.data;
      setCitas(Array.isArray(data) ? data : []);
    } catch (error) { console.error("Error al cargar:", error); }
  };

  useEffect(() => { cargarCitas(); }, []);

  const guardarCita = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const datosCita = { nombre, fecha, motivo, precio: Number(precio) };

      if (modoEdicion) {
        await axios.put(`http://localhost:3000/api/citas/${citaId}`, datosCita, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('✅ Cita actualizada');
      } else {
        await axios.post('http://localhost:3000/api/citas', datosCita, {
          headers: { Authorization: `Bearer ${token}` }
        });
        alert('✅ Cita guardada');
      }
      limpiarFormulario();
      cargarCitas();
    } catch (error) { alert('❌ Error al guardar'); }
  };

  const iniciarEdicion = (cita) => {
    setNombre(cita.nombre || cita.paciente || '');
    setFecha(cita.fecha ? new Date(cita.fecha).toISOString().slice(0, 16) : '');
    setMotivo(cita.motivo);
    setPrecio(cita.precio || 500);
    setModoEdicion(true);
    setCitaId(cita._id);
  };

  const limpiarFormulario = () => {
    setNombre(''); setFecha(''); setMotivo(''); setPrecio(500);
    setModoEdicion(false); setCitaId(null);
  };

  const eliminarCita = async (id) => {
    if (!window.confirm("¿Eliminar cita?")) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/api/citas/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      cargarCitas();
    } catch (error) { alert("Error al eliminar"); }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1100px', margin: '0 auto', fontFamily: 'Arial' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2 style={{ color: '#0056b3' }}>🩺 Doc-Time Panel</h2>
        <button onClick={() => { localStorage.clear(); navigate('/'); }} style={{ cursor: 'pointer' }}>Cerrar Sesión</button>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '20px' }}>
        {/* LADO IZQUIERDO: FORMULARIO Y CALCULADORA */}
        <div style={{ background: '#f4f4f4', padding: '20px', borderRadius: '8px' }}>
          <h3>{modoEdicion ? '✏️ Editar Cita' : '➕ Nueva Cita'}</h3>
          <form onSubmit={guardarCita} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input type="text" placeholder="Paciente" value={nombre} onChange={e => setNombre(e.target.value)} required style={{ padding: '8px' }} />
            <input type="datetime-local" value={fecha} onChange={e => setFecha(e.target.value)} required style={{ padding: '8px' }} />
            <input type="text" placeholder="Motivo" value={motivo} onChange={e => setMotivo(e.target.value)} required style={{ padding: '8px' }} />
            <input type="number" placeholder="Precio MXN" value={precio} onChange={e => setPrecio(e.target.value)} style={{ padding: '8px' }} />
            <button type="submit" style={{ background: modoEdicion ? 'orange' : 'green', color: 'white', padding: '10px', cursor: 'pointer', border: 'none', borderRadius: '4px' }}>
              {modoEdicion ? 'GUARDAR CAMBIOS' : 'AGENDAR CITA'}
            </button>
          </form>

          <div style={{ marginTop: '20px', padding: '15px', background: '#eefcf5', borderRadius: '8px', border: '1px solid #c3e6cb' }}>
            <h4 style={{ margin: '0 0 10px 0' }}>💰 Divisas</h4>
            <p style={{ margin: '5px 0' }}>MXN: ${precio}</p>
            <p style={{ margin: '5px 0' }}>USD: ${(precio / 19.5).toFixed(2)}</p>
            <p style={{ margin: '5px 0' }}>EUR: ${(precio / 21.2).toFixed(2)}</p>
          </div>
        </div>

        {/* LADO DERECHO: TABLA */}
        <div>
          <table border="1" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: '#0056b3', color: 'white' }}>
                <th style={{ padding: '10px' }}>Paciente</th>
                <th style={{ padding: '10px' }}>Fecha</th>
                <th style={{ padding: '10px' }}>Precio</th>
                <th style={{ padding: '10px' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {citas.map(c => (
                <tr key={c._id} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '10px' }}>{c.nombre || c.paciente}</td>
                  <td style={{ padding: '10px' }}>{new Date(c.fecha).toLocaleString()}</td>
                  <td style={{ padding: '10px', color: 'green', fontWeight: 'bold' }}>${c.precio || 0} MXN</td>
                  <td style={{ padding: '10px' }}>
                    <button onClick={() => iniciarEdicion(c)} style={{ marginRight: '5px' }}>✏️</button>
                    <button onClick={() => eliminarCita(c._id)} style={{ color: 'red' }}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;