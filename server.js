const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { supabase } = require('./supabaseClient');
const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cors());

// --- Mock DB (sólo para ejemplo, cambia por tu acceso real a BD) ---
let users = [];
let events = [];
let eventLocations = [];
let enrollments = [];
let tags = [];

// --- Helpers ---
function validateEmail(email) {
    // Email simple regex
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.status(401).json({ success: false, message: 'No token provided.' });
    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ success: false, message: 'No token provided.' });
    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(401).json({ success: false, message: 'Token inválido.' });
        req.user = user;
        next();
    });
}

// --- USER AUTH ---
app.post('/api/user/register', (req, res) => {
    const { first_name, last_name, username, password } = req.body;
    if (!first_name || first_name.length < 3 || !last_name || last_name.length < 3)
        return res.status(400).json({ success: false, message: "Nombre/apellido muy cortos." });
    if (!validateEmail(username))
        return res.status(400).json({ success: false, message: "El email es invalido." });
    if (!password || password.length < 3)
        return res.status(400).json({ success: false, message: "Password muy corto." });
    if (users.some(u => u.username === username))
        return res.status(400).json({ success: false, message: "El usuario ya existe." });

    const id = users.length + 1;
    users.push({ id, first_name, last_name, username, password });
    return res.status(201).json({ success: true, message: "Usuario creado." });
});

app.post('/api/user/login', (req, res) => {
    const { username, password } = req.body;
    if (!validateEmail(username))
        return res.status(400).json({ success: false, message: "El email es invalido.", token: "" });
    const user = users.find(u => u.username === username && u.password === password);
    if (!user)
        return res.status(401).json({ success: false, message: "Usuario o clave inválida.", token: "" });
    const token = jwt.sign({ id: user.id, first_name: user.first_name, username: user.username }, SECRET_KEY, { expiresIn: "2h" });
    return res.status(200).json({ success: true, message: "", token });
});


// --- EVENTS ---
// GET /api/event/ (Paginado y filtrado)
app.get('/api/event', (req, res) => {
    let { name, startdate, tag, limit, offset } = req.query;
    limit = parseInt(limit) || 5; // paginado en 5 por default
    offset = parseInt(offset) || 0;

    let filteredEvents = events;

    if (name) filteredEvents = filteredEvents.filter(e => e.name.toLowerCase().includes(name.toLowerCase()));
    if (startdate) filteredEvents = filteredEvents.filter(e => e.start_date.startsWith(startdate));
    if (tag) filteredEvents = filteredEvents.filter(e => e.tags && e.tags.some(t => t.name.toLowerCase().includes(tag.toLowerCase())));

    // Paginar
    const paginated = filteredEvents.slice(offset, offset + limit);

    // Formato de respuesta
    const collection = paginated.map(event => ({
        ...event,
        // remueve campos sensibles o ajusta el objeto como tu ejemplo
    }));

    const nextPage = offset + limit < filteredEvents.length
        ? `/api/event?limit=${limit}&offset=${offset + limit}` +
            (name ? `&name=${name}` : '') +
            (startdate ? `&startdate=${startdate}` : '') +
            (tag ? `&tag=${tag}` : '')
        : null;

    res.json({
        collection,
        pagination: {
            limit,
            offset,
            nextPage,
            total: filteredEvents.length
        }
    });
});

// GET /api/event/:id
app.get('/api/event/:id', (req, res) => {
    const event = events.find(e => e.id == req.params.id);
    if (!event) return res.status(404).json({ message: "Evento no encontrado." });
    res.status(200).json(event);
});

// POST /api/event/ (autenticado)
app.post('/api/event', authenticateToken, (req, res) => {
    const { name, description, id_event_location, start_date, duration_in_minutes, price, enabled_for_enrollment, max_assistance, tags: tagIds } = req.body;
    // Validaciones de negocio
    if (!name || name.length < 3 || !description || description.length < 3)
        return res.status(400).json({ message: "Nombre/descripción inválidos" });
    const location = eventLocations.find(loc => loc.id == id_event_location);
    if (!location) return res.status(400).json({ message: "Ubicación no válida." });
    if (max_assistance > location.max_capacity)
        return res.status(400).json({ message: "max_assistance supera la capacidad del lugar." });
    if (price < 0 || duration_in_minutes < 0)
        return res.status(400).json({ message: "Precio/duración inválidos" });

    const event = {
        id: events.length + 1,
        name,
        description,
        id_event_location,
        start_date,
        duration_in_minutes,
        price,
        enabled_for_enrollment,
        max_assistance,
        id_creator_user: req.user.id,
        event_location: location,
        tags: tags.filter(t => tagIds && tagIds.includes(t.id)),
        creator_user: users.find(u => u.id === req.user.id)
    };
    events.push(event);
    res.status(201).json(event);
});

// PUT /api/event/ (autenticado)
app.put('/api/event', authenticateToken, (req, res) => {
    const { id, ...update } = req.body;
    const idx = events.findIndex(e => e.id == id);
    if (idx === -1) return res.status(404).json({ message: "Evento no encontrado." });
    if (events[idx].id_creator_user !== req.user.id)
        return res.status(404).json({ message: "No autorizado para editar este evento." });

    // Validaciones iguales a POST
    Object.assign(events[idx], update);
    res.status(200).json(events[idx]);
});

// DELETE /api/event/:id (autenticado)
app.delete('/api/event/:id', authenticateToken, (req, res) => {
    const idx = events.findIndex(e => e.id == req.params.id);
    if (idx === -1) return res.status(404).json({ message: "Evento no encontrado." });
    if (events[idx].id_creator_user !== req.user.id)
        return res.status(404).json({ message: "No autorizado para eliminar este evento." });

    // Validar si hay inscriptos
    if (enrollments.some(enr => enr.eventId == req.params.id))
        return res.status(400).json({ message: "Hay usuarios inscriptos, no se puede eliminar." });

    const deleted = events.splice(idx, 1);
    res.status(200).json(deleted[0]);
});

// --- INSCRIPCIÓN A EVENTOS ---
app.post('/api/event/:id/enrollment', authenticateToken, (req, res) => {
    const event = events.find(e => e.id == req.params.id);
    if (!event) return res.status(404).json({ message: "Evento no encontrado." });

    // Validaciones: capacidad, fecha, habilitado, ya registrado
    const now = new Date();
    const eventDate = new Date(event.start_date);
    if (event.max_assistance <= enrollments.filter(e => e.eventId == event.id).length)
        return res.status(400).json({ message: "Capacidad completa." });
    if (eventDate <= now)
        return res.status(400).json({ message: "El evento ya sucedió o es hoy." });
    if (!event.enabled_for_enrollment)
        return res.status(400).json({ message: "Evento no habilitado para inscripción." });
    if (enrollments.some(e => e.eventId == event.id && e.userId == req.user.id))
        return res.status(400).json({ message: "Ya inscripto." });

    enrollments.push({ eventId: event.id, userId: req.user.id, registration_date_time: now });
    res.status(201).json({ success: true });
});

app.delete('/api/event/:id/enrollment', authenticateToken, (req, res) => {
    const event = events.find(e => e.id == req.params.id);
    if (!event) return res.status(404).json({ message: "Evento no encontrado." });

    const now = new Date();
    const eventDate = new Date(event.start_date);
    if (eventDate <= now)
        return res.status(400).json({ message: "El evento ya sucedió o es hoy." });

    const idx = enrollments.findIndex(e => e.eventId == event.id && e.userId == req.user.id);
    if (idx === -1) return res.status(400).json({ message: "No estás inscripto." });

    enrollments.splice(idx, 1);
    res.status(200).json({ success: true });
});

// --- EVENT LOCATIONS ---
app.get('/api/event-location', authenticateToken, (req, res) => {
    const userLocs = eventLocations.filter(loc => loc.id_creator_user === req.user.id);
    res.status(200).json(userLocs);
});

app.get('/api/event-location/:id', authenticateToken, (req, res) => {
    const loc = eventLocations.find(loc => loc.id == req.params.id && loc.id_creator_user === req.user.id);
    if (!loc) return res.status(404).json({ message: "No encontrado o no autorizado." });
    res.status(200).json(loc);
});


app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});