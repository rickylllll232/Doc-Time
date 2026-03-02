import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login';
import Dashboard from './pages/Dashboard';

function App() {
  // Verificamos si el usuario ya tiene un token guardado
 const isAuthenticated = !!localStorage.getItem('token');

  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta del Login */}
        <Route path="/" element={<Login />} />
        
        {/* Ruta protegida del Dashboard (Si no está logueado, lo regresa al Login) */}
        <Route 
          path="/dashboard" 
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />} 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;