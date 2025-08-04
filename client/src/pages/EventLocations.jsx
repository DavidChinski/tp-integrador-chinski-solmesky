import { useState } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Button, Box } from '@mui/material';
import NavBar from '../components/NavBar';
import { useAuth } from '../context/AuthContext';

// Gestión básica de ubicaciones de eventos (crear, buscar, actualizar, eliminar)
const EventLocations = () => {
  const { token } = useAuth();
  const [searchId, setSearchId] = useState('');
  const [form, setForm] = useState({
    name: '', full_address: '', latitude: '', longitude: '', max_capacity: '', id_location: ''
  });
  const [isEditing, setIsEditing] = useState(false);

  const headers = { Authorization: `Bearer ${token}` };

  const fetchLocation = async () => {
    try {
      const res = await axios.get(`http://localhost:3000/api/event-location/${searchId}`, { headers });
      setForm({
        name: res.data.name || '',
        full_address: res.data.full_address || '',
        latitude: res.data.latitude || '',
        longitude: res.data.longitude || '',
        max_capacity: res.data.max_capacity || '',
        id_location: res.data.id_location || ''
      });
      setIsEditing(true);
    } catch (err) {
      setIsEditing(false);
    }
  };

  const saveLocation = async () => {
    const payload = {
      name: form.name,
      full_address: form.full_address,
      latitude: Number(form.latitude),
      longitude: Number(form.longitude),
      max_capacity: Number(form.max_capacity),
      id_location: Number(form.id_location)
    };

    if (isEditing) {
      await axios.put(`http://localhost:3000/api/event-location/${searchId}`, payload, { headers });
    } else {
      await axios.post('http://localhost:3000/api/event-location', payload, { headers });
    }
  };

  const deleteLocation = async () => {
    await axios.delete(`http://localhost:3000/api/event-location/${searchId}`, { headers });
    setForm({ name: '', full_address: '', latitude: '', longitude: '', max_capacity: '', id_location: '' });
    setIsEditing(false);
  };

  return (
    <>
      <NavBar />
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>Ubicaciones</Typography>
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <TextField label="ID" value={searchId} onChange={e => setSearchId(e.target.value)} />
          <Button variant="contained" onClick={fetchLocation}>Buscar</Button>
        </Box>

        <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField label="Nombre" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <TextField label="Dirección" value={form.full_address} onChange={e => setForm({ ...form, full_address: e.target.value })} />
          <TextField label="Latitud" value={form.latitude} onChange={e => setForm({ ...form, latitude: e.target.value })} />
          <TextField label="Longitud" value={form.longitude} onChange={e => setForm({ ...form, longitude: e.target.value })} />
          <TextField label="Capacidad" value={form.max_capacity} onChange={e => setForm({ ...form, max_capacity: e.target.value })} />
          <TextField label="ID Location" value={form.id_location} onChange={e => setForm({ ...form, id_location: e.target.value })} />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="contained" onClick={saveLocation}>{isEditing ? 'Actualizar' : 'Crear'}</Button>
            {isEditing && <Button variant="outlined" color="error" onClick={deleteLocation}>Eliminar</Button>}
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default EventLocations;
