import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Componente que restringe el acceso a rutas privadas
const ProtectedRoute = () => {
  const { token } = useAuth();
  // Si existe un token se muestra el contenido hijo, de lo contrario se redirige al login
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
