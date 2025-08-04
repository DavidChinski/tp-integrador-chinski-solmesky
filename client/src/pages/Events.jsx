import { useEffect, useState } from 'react';
import axios from 'axios';
import { Container, Typography, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import NavBar from '../components/NavBar';

// Vista que muestra el listado de eventos disponibles
const Events = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Obtiene los eventos del backend
    axios.get('http://localhost:3000/api/event')
      .then(res => setEvents(res.data.collection || []))
      .catch(err => console.error(err));
  }, []);

  return (
    <>
      <NavBar />
      <Container sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>Eventos</Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Precio</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {events.map(ev => (
              <TableRow key={ev.id}>
                <TableCell>{ev.name}</TableCell>
                <TableCell>{ev.start_date}</TableCell>
                <TableCell>{ev.price}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Container>
    </>
  );
};

export default Events;
