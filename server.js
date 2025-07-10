// server.js

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { supabase } = require("./supabaseClient");

const app = express();
const PORT = 3000;
const SECRET_KEY = "tu_clave_secreta_super_segura";

// Middlewares globales
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ========== Funciones auxiliares ==========
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function isValidString(str) {
  return typeof str === "string" && str.trim().length >= 3;
}
function isPositiveNumber(n) {
  return typeof n === "number" && n >= 0;
}
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No autenticado." });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(401).json({ message: "Token inválido." });
    req.user = user;
    next();
  });
}

// ========== AUTH ==========
app.post("/api/user/register", async (req, res) => {
  const { first_name, last_name, username, password } = req.body;

  if (!isValidString(first_name) || !isValidString(last_name))
    return res.status(400).json({ success: false, message: "Nombre inválido." });
  if (!isValidEmail(username))
    return res.status(400).json({ success: false, message: "El email es inválido." });
  if (!isValidString(password))
    return res.status(400).json({ success: false, message: "Contraseña inválida." });

  const { data: existingUser } = await supabase
    .from("users")
    .select("id")
    .eq("username", username)
    .single();
  if (existingUser)
    return res.status(400).json({ success: false, message: "El usuario ya existe." });

    const { data, error } = await supabase
    .from("users")
    .insert([{ first_name, last_name, username, password }])
    .select()
    .single();
  
  if (error) {
    console.error("Error al insertar usuario:", error);
    return res.status(500).json({ success: false, message: "Error al registrar.", details: error.message });
  }
  
  res.status(201).json({ success: true, message: "Usuario registrado correctamente.", user: data });
  
});

app.post("/api/user/login", async (req, res) => {
  const { username, password } = req.body;

  if (!isValidEmail(username))
    return res.status(400).json({ success: false, message: "El email es inválido.", token: "" });

  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("username", username)
    .eq("password", password)
    .single();
  if (!user)
    return res.status(401).json({ success: false, message: "Usuario o clave inválida.", token: "" });

  const token = jwt.sign(user, SECRET_KEY, { expiresIn: "12h" });
  res.status(200).json({ success: true, token });
});

// ========== GET Eventos (listado con filtros) ==========
app.get("/api/event", async (req, res) => {
  const { limit = 15, offset = 0, name, startdate, tag } = req.query;
  let query = supabase.from("events").select(`
    id, name, description, start_date, duration_in_minutes, price,
    enabled_for_enrollment, max_assistance,
    creator_user:users ( id, username, first_name, last_name ),
    event_location:event_locations (
      id, name, full_address, latitude, longitude, max_capacity,
      location:locations (
        id, name, latitude, longitude,
        province:provinces ( id, name, full_name, latitude, longitude )
      )
    ),
    tags ( id, name )
  `, { count: "exact" });

  if (name) query = query.ilike("name", `%${name}%`);
  if (startdate) query = query.eq("start_date", startdate);

  query = query.range(Number(offset), Number(offset) + Number(limit) - 1);

  try {
    let { data, error, count } = await query;
    if (error) return res.status(500).json({ message: error.message });

    if (tag) {
      data = data.filter(event =>
        (event.tags || []).some(t => t.name.toLowerCase().includes(tag.toLowerCase()))
      );
      count = data.length;
    }

    res.status(200).json({
      collection: data,
      pagination: {
        limit: Number(limit),
        offset: Number(offset),
        total: count,
        nextPage: Number(offset) + Number(limit) < count ? Number(offset) + Number(limit) : null,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Error interno", error: err.message });
  }
});

// ========== GET Detalle de evento ==========
app.get("/api/event/:id", async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from("events")
    .select(`
      *, creator_user:users (*),
      event_location:event_locations (
        *, location:locations (
          *, province:provinces (*)
        ),
        creator_user:users (*)
      ),
      tags (id, name)
    `)
    .eq("id", id)
    .single();

  if (!data || error) return res.status(404).json({ message: "Evento no encontrado." });

  res.status(200).json(data);
});

// ========== CRUD Evento ==========
app.post("/api/event", authenticateToken, async (req, res) => {
  const { name, description, start_date, duration_in_minutes, price, enabled_for_enrollment, max_assistance, id_event_location, tags } = req.body;
  const id_creator_user = req.user.id;

  if (!isValidString(name) || !isValidString(description)) return res.status(400).json({ message: "Nombre o descripción inválidos." });
  if (!isPositiveNumber(price) || !isPositiveNumber(duration_in_minutes)) return res.status(400).json({ message: "Duración o precio inválidos." });

  const { data: loc } = await supabase.from("event_locations").select("max_capacity").eq("id", id_event_location).single();
  if (!loc || max_assistance > loc.max_capacity) return res.status(400).json({ message: "Capacidad excedida." });

  const { data: event, error } = await supabase.from("events").insert([{
    name, description, start_date, duration_in_minutes, price,
    enabled_for_enrollment, max_assistance, id_event_location, id_creator_user
  }]).select().single();

  if (error) return res.status(500).json({ message: "Error al crear." });
  res.status(201).json(event);
});

app.put("/api/event", authenticateToken, async (req, res) => {
  const { id, ...updates } = req.body;
  const id_creator_user = req.user.id;

  const { data: event } = await supabase.from("events").select("*").eq("id", id).single();
  if (!event || event.id_creator_user !== id_creator_user)
    return res.status(404).json({ message: "No autorizado o evento no encontrado." });

  const { data: updatedEvent, error } = await supabase.from("events").update(updates).eq("id", id).select().single();
  if (error) return res.status(500).json({ message: "Error al actualizar." });

  res.status(200).json(updatedEvent);
});

app.delete("/api/event/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const id_creator_user = req.user.id;

  const { data: event } = await supabase.from("events").select("*").eq("id", id).single();
  if (!event || event.id_creator_user !== id_creator_user)
    return res.status(404).json({ message: "No autorizado o evento no encontrado." });

  const { data: enrollments } = await supabase.from("event_enrollments").select("id").eq("id_event", id);
  if (enrollments.length > 0) return res.status(400).json({ message: "Usuarios inscriptos. No se puede eliminar." });

  const { error } = await supabase.from("events").delete().eq("id", id);
  if (error) return res.status(500).json({ message: "Error al eliminar." });

  res.status(200).json({ message: "Eliminado correctamente." });
});

// ========== INSCRIPCIÓN ==========
app.post("/api/event/:id/enrollment", authenticateToken, async (req, res) => {
  const eventId = parseInt(req.params.id);
  const userId = req.user.id;
  const now = new Date();

  const { data: event } = await supabase.from("events").select("*").eq("id", eventId).single();
  if (!event) return res.status(404).json({ message: "Evento no encontrado." });

  const eventDate = new Date(event.start_date);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (eventDate <= today) return res.status(400).json({ message: "Evento ya pasó o es hoy." });
  if (!event.enabled_for_enrollment) return res.status(400).json({ message: "No habilitado para inscripción." });

  const { data: already } = await supabase.from("event_enrollments").select("*").eq("id_event", eventId).eq("id_user", userId).single();
  if (already) return res.status(400).json({ message: "Ya inscripto." });

  const { data: count } = await supabase.from("event_enrollments").select("id").eq("id_event", eventId);
  if (count.length >= event.max_assistance) return res.status(400).json({ message: "Cupo lleno." });

  const { error } = await supabase.from("event_enrollments").insert([{ id_event: eventId, id_user: userId, registration_date_time: now.toISOString() }]);
  if (error) return res.status(500).json({ message: "Error al inscribirse." });

  res.status(201).json({ message: "Inscripción exitosa." });
});

app.delete("/api/event/:id/enrollment", authenticateToken, async (req, res) => {
  const eventId = parseInt(req.params.id);
  const userId = req.user.id;
  const now = new Date();

  const { data: event } = await supabase.from("events").select("*").eq("id", eventId).single();
  if (!event) return res.status(404).json({ message: "Evento no encontrado." });

  const eventDate = new Date(event.start_date);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (eventDate <= today) return res.status(400).json({ message: "Evento ya pasó o es hoy." });

  const { data: enrollment } = await supabase.from("event_enrollments").select("*").eq("id_event", eventId).eq("id_user", userId).single();
  if (!enrollment) return res.status(400).json({ message: "No estás inscripto." });

  const { error } = await supabase.from("event_enrollments").delete().eq("id", enrollment.id);
  if (error) return res.status(500).json({ message: "Error al cancelar." });

  res.status(200).json({ message: "Inscripción cancelada." });
});

// ========== UBICACIONES ==========
app.get("/api/event-location", authenticateToken, async (req, res) => {
  const { limit = 15, offset = 0 } = req.query;
  const userId = req.user.id;

  const { data, error, count } = await supabase
    .from("event_locations")
    .select("*", { count: "exact" })
    .eq("id_creator_user", userId)
    .range(Number(offset), Number(offset) + Number(limit) - 1);

  if (error) return res.status(500).json({ message: "Error al obtener ubicaciones." });

  res.status(200).json({
    collection: data,
    pagination: {
      limit: Number(limit),
      offset: Number(offset),
      total: count,
      nextPage: Number(offset) + Number(limit) < count ? Number(offset) + Number(limit) : null,
    },
  });
});

app.get("/api/event-location/:id", authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  const { data, error } = await supabase
    .from("event_locations")
    .select("*")
    .eq("id", id)
    .eq("id_creator_user", userId)
    .single();

  if (!data || error) return res.status(404).json({ message: "Ubicación no encontrada." });

  res.status(200).json(data);
});

// ========== START SERVER ==========
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
