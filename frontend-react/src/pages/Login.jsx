import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setMensaje('Verificando...');
    try {
      const res = await axios.post('http://127.0.0.1:3000/api/auth/login', { 
    email: email.trim(), 
    password: password 
});

      if (res.data.token) {
        localStorage.setItem('token', res.data.token);
window.location.href = '/dashboard'; 
        // Opcional: Guardar datos del usuario si el backend los envía
        if (res.data.user) localStorage.setItem('user', JSON.stringify(res.data.user));
        
        navigate('/dashboard');
      }
    } catch (err) {
      console.error("Error detallado de Login:", err.response?.data);
      const errorMsg = err.response?.data?.message || 'Error: Credenciales no válidas o servidor apagado';
      setMensaje(errorMsg);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#f0f2f5', fontFamily: 'Arial' }}>
      <form onSubmit={handleLogin} style={{ background: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', width: '100%', maxWidth: '380px' }}>
        <h2 style={{ textAlign: 'center', color: '#0056b3', marginBottom: '20px' }}>🩺 Doc-Time</h2>
        
        {mensaje && (
          <div style={{ backgroundColor: mensaje.includes('Error') ? '#ffeef0' : '#eef6ff', color: mensaje.includes('Error') ? '#dc3545' : '#0056b3', padding: '10px', borderRadius: '5px', marginBottom: '15px', textAlign: 'center', fontSize: '14px' }}>
            {mensaje}
          </div>
        )}
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' }} placeholder="usuario@doctime.com" />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Contraseña:</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' }} placeholder="••••••••" />
        </div>

        <button type="submit" style={{ width: '100%', padding: '12px', background: '#0056b3', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '16px' }}>
          INGRESAR AL PANEL
        </button>
      </form>
    </div>
  );
};

export default Login;