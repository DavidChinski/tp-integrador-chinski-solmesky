import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Barra de navegación simple para moverse entre vistas
const NavBar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>Gestor</Typography>
        <Button color="inherit" component={Link} to="/events">Eventos</Button>
        <Button color="inherit" component={Link} to="/locations">Ubicaciones</Button>
        <Button color="inherit" onClick={handleLogout}>Salir</Button>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
