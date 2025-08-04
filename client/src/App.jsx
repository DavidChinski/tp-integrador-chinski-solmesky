import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Events from './pages/Events';
import EventLocations from './pages/EventLocations';
import './App.css';

// Componente raíz de la aplicación. Define las rutas y provee el contexto de autenticación.
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* Rutas protegidas */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Events />} />
            <Route path="/events" element={<Events />} />
            <Route path="/locations" element={<EventLocations />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
