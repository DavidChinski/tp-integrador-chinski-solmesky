import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button, Container, Typography, Box } from '@mui/material';
import { useAuth } from '../context/AuthContext';

// Pantalla de inicio de sesión
const Login = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:3000/api/user/login', form);
      if (res.data.success) {
        login(res.data.token);
        navigate('/events');
      } else {
        setError(res.data.message || 'Error al iniciar sesión');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">Iniciar sesión</Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField margin="normal" required fullWidth label="Email" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} />
          <TextField margin="normal" required fullWidth type="password" label="Contraseña" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
          {error && <Typography color="error" variant="body2">{error}</Typography>}
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>Ingresar</Button>
          <Typography variant="body2">¿No tenés cuenta? <Link to="/register">Registrate</Link></Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
