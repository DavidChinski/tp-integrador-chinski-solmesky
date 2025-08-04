import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TextField, Button, Container, Typography, Box } from '@mui/material';

// Página de registro de nuevos usuarios
const Register = () => {
  const [form, setForm] = useState({ first_name: '', last_name: '', username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axios.post('http://localhost:3000/api/user/register', form);
      if (res.data.success) {
        navigate('/login');
      } else {
        setError(res.data.message || 'Error al registrarse');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrarse');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">Registro</Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField margin="normal" required fullWidth label="Nombre" value={form.first_name} onChange={e => setForm({ ...form, first_name: e.target.value })} />
          <TextField margin="normal" required fullWidth label="Apellido" value={form.last_name} onChange={e => setForm({ ...form, last_name: e.target.value })} />
          <TextField margin="normal" required fullWidth label="Email" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} />
          <TextField margin="normal" required fullWidth type="password" label="Contraseña" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
          {error && <Typography color="error" variant="body2">{error}</Typography>}
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>Registrarse</Button>
          <Typography variant="body2">¿Ya tenés cuenta? <Link to="/login">Ingresar</Link></Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Register;
