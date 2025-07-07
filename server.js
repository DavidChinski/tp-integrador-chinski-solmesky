// Importaciones necesarias
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { supabase } = require("./supabaseClient.js");
const app = express();

// Middlewares globales
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = 3000;

// Endpoint paginado para obtener eventos
app.get("/api/event", async (req, res) => {
  // Parámetros de paginación, con valores por defecto
  const { limit = 15, offset = 0 } = req.query;

  try {
    // Consulta a Supabase con relaciones anidadas
    const { data, error, count } = await supabase
      .from("events")
      .select(
        `
        id,
        name,
        description,
        start_date,
        duration_in_minutes,
        price,
        enabled_for_enrollment,
        max_assistance,
        creator_user:users (
          id,
          username,
          first_name,
          last_name
        ),
        event_location:event_locations (
          id,
          name,
          full_address,
          latitude,
          longitude,
          max_capacity,
          location:locations (
            id,
            name,
            latitude,
            longitude,
            province:provinces (
              id,
              name,
              full_name,
              latitude,
              longitude
            )
          )
        )
        -- Si tienes tags y la relación creada, descomenta la línea siguiente
        -- ,tags (
        --   id,
        --   name
        -- )
      `,
        { count: "exact" }
      )
      .range(Number(offset), Number(offset) + Number(limit) - 1);

    // Manejo de errores de la consulta
    if (error) {
      console.error("Error en consulta Supabase:", error);
      return res.status(500).json({ message: error.message });
    }

    // Respuesta exitosa
    res.status(200).json({
      collection: data,
      pagination: {
        limit: Number(limit),
        offset: Number(offset),
        total: count,
        nextPage:
          Number(offset) + Number(limit) < count
            ? Number(offset) + Number(limit)
            : null,
      },
    });
  } catch (err) {
    // Manejo de errores generales
    console.error("Error interno del servidor:", err);
    res.status(500).json({ message: "Error interno", error: err.message });
  }
});

// ... (importaciones y middlewares igual que antes)

app.get("/api/event", async (req, res) => {
  const { limit = 15, offset = 0, name, startdate, tag } = req.query;

  // Armado de filtros dinámicos para la consulta
  let filters = [];
  if (name) {
    // Busca por nombre (case insensitive)
    filters.push(`name.ilike.%${name}%`);
  }
  if (startdate) {
    // Busca por fecha exacta (YYYY-MM-DD)
    filters.push(`start_date.eq.${startdate}`);
  }
  // El filtro de tag lo hacemos luego, ya que requiere filtrar el array resultante

  try {
    // Consulta a Supabase con relaciones anidadas
    let query = supabase.from("events").select(
      `
          id,
          name,
          description,
          start_date,
          duration_in_minutes,
          price,
          enabled_for_enrollment,
          max_assistance,
          creator_user:users (
            id,
            username,
            first_name,
            last_name
          ),
          event_location:event_locations (
            id,
            name,
            full_address,
            latitude,
            longitude,
            max_capacity,
            location:locations (
              id,
              name,
              latitude,
              longitude,
              province:provinces (
                id,
                name,
                full_name,
                latitude,
                longitude
              )
            )
          ),
          tags (
            id,
            name
          )
        `,
      { count: "exact" }
    );

    // Aplica los filtros dinámicamente
    filters.forEach((filter) => {
      const [field, op, value] = filter.split(".");
      query = query.filter(field, op, value);
    });

    // Rango para paginación
    query = query.range(Number(offset), Number(offset) + Number(limit) - 1);

    // Ejecuta la consulta
    let { data, error, count } = await query;

    if (error) {
      console.error("Error en consulta Supabase:", error);
      return res.status(500).json({ message: error.message });
    }

    // Si hay filtro por tag, filtramos manualmente el array
    if (tag) {
      data = data.filter((event) =>
        (event.tags || []).some((t) =>
          t.name.toLowerCase().includes(tag.toLowerCase())
        )
      );
      // El total cambia si hay filtro por tag
      count = data.length;
    }

    res.status(200).json({
      collection: data,
      pagination: {
        limit: Number(limit),
        offset: Number(offset),
        total: count,
        nextPage:
          Number(offset) + Number(limit) < count
            ? Number(offset) + Number(limit)
            : null,
      },
    });
  } catch (err) {
    console.error("Error interno del servidor:", err);
    res.status(500).json({ message: "Error interno", error: err.message });
  }
});

app.get("/api/event/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // Consulta con relaciones anidadas
    const { data, error } = await supabase
      .from("events")
      .select(
        `
          *,
          creator_user:users (
            id,
            first_name,
            last_name,
            username,
            password
          ),
          event_location:event_locations (
            *,
            location:locations (
              *,
              province:provinces (
                *
              )
            ),
            creator_user:users (
              id,
              first_name,
              last_name,
              username,
              password
            )
          ),
          tags (
            id,
            name
          )
        `
      )
      .eq("id", id)
      .single();

    // Si no existe el evento, status 404
    if (!data || error) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }

    // Respuesta exitosa
    res.status(200).json(data);
  } catch (err) {
    console.error("Error interno del servidor:", err);
    res.status(500).json({ message: "Error interno", error: err.message });
  }
});

const jwt = require("jsonwebtoken");
const SECRET_KEY = "tu_clave_secreta_super_segura"; // Usá una clave fuerte en producción

// Función para validar email
function isValidEmail(email) {
  // Regex simple para validar emails
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Función para validar nombres y password
function isValidString(str) {
  return typeof str === "string" && str.trim().length >= 3;
}

// ========== REGISTRACIÓN ==========
app.post("/api/user/register", async (req, res) => {
  const { first_name, last_name, username, password } = req.body;

  // Validaciones
  if (!isValidString(first_name)) {
    return res
      .status(400)
      .json({
        success: false,
        message:
          "El campo first_name es obligatorio y debe tener al menos 3 letras.",
      });
  }
  if (!isValidString(last_name)) {
    return res
      .status(400)
      .json({
        success: false,
        message:
          "El campo last_name es obligatorio y debe tener al menos 3 letras.",
      });
  }
  if (!isValidEmail(username)) {
    return res
      .status(400)
      .json({ success: false, message: "El email es invalido." });
  }
  if (!isValidString(password)) {
    return res
      .status(400)
      .json({
        success: false,
        message:
          "El campo password es obligatorio y debe tener al menos 3 letras.",
      });
  }

  // Verifica si el usuario ya existe
  const { data: existingUser, error: userError } = await supabase
    .from("users")
    .select("id")
    .eq("username", username)
    .single();

  if (existingUser) {
    return res
      .status(400)
      .json({ success: false, message: "El usuario ya existe." });
  }

  // Inserta nuevo usuario
  const { data, error } = await supabase
    .from("users")
    .insert([{ first_name, last_name, username, password }])
    .select()
    .single();

  if (error) {
    return res
      .status(500)
      .json({ success: false, message: "Error al registrar usuario." });
  }

  res
    .status(201)
    .json({ success: true, message: "Usuario registrado correctamente." });
});

// ========== LOGIN ==========
app.post("/api/user/login", async (req, res) => {
  const { username, password } = req.body;

  // Validación de email
  if (!isValidEmail(username)) {
    return res
      .status(400)
      .json({ success: false, message: "El email es invalido.", token: "" });
  }

  // Busca el usuario
  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("username", username)
    .eq("password", password)
    .single();

  if (!user) {
    return res
      .status(401)
      .json({
        success: false,
        message: "Usuario o clave inválida.",
        token: "",
      });
  }

  // Genera el JWT
  const token = jwt.sign(
    {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      username: user.username,
    },
    SECRET_KEY,
    { expiresIn: "12h" }
  );

  res.status(200).json({ success: true, message: "", token });
});

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

// Validaciones auxiliares
function isValidString(str) {
  return typeof str === "string" && str.trim().length >= 3;
}
function isPositiveNumber(n) {
  return typeof n === "number" && n >= 0;
}

// ========== CREAR EVENTO ==========
app.post("/api/event", authenticateToken, async (req, res) => {
  const {
    name,
    description,
    start_date,
    duration_in_minutes,
    price,
    enabled_for_enrollment,
    max_assistance,
    id_event_location,
    tags,
  } = req.body;
  const id_creator_user = req.user.id;

  // Validaciones de negocio
  if (!isValidString(name)) {
    return res
      .status(400)
      .json({
        message: "El campo name es obligatorio y debe tener al menos 3 letras.",
      });
  }
  if (!isValidString(description)) {
    return res
      .status(400)
      .json({
        message:
          "El campo description es obligatorio y debe tener al menos 3 letras.",
      });
  }
  if (!isPositiveNumber(price)) {
    return res
      .status(400)
      .json({ message: "El campo price debe ser mayor o igual a 0." });
  }
  if (!isPositiveNumber(duration_in_minutes)) {
    return res
      .status(400)
      .json({
        message: "El campo duration_in_minutes debe ser mayor o igual a 0.",
      });
  }

  // Validar max_assistance <= max_capacity del event_location
  const { data: eventLoc, error: locError } = await supabase
    .from("event_locations")
    .select("max_capacity")
    .eq("id", id_event_location)
    .single();

  if (locError || !eventLoc) {
    return res
      .status(400)
      .json({ message: "Ubicación del evento no encontrada." });
  }
  if (max_assistance > eventLoc.max_capacity) {
    return res
      .status(400)
      .json({
        message:
          "max_assistance no puede ser mayor que max_capacity de la ubicación.",
      });
  }

  // Crear evento
  const { data: newEvent, error } = await supabase
    .from("events")
    .insert([
      {
        name,
        description,
        start_date,
        duration_in_minutes,
        price,
        enabled_for_enrollment,
        max_assistance,
        id_event_location,
        id_creator_user,
      },
    ])
    .select()
    .single();

  if (error)
    return res.status(500).json({ message: "Error al crear el evento." });

  // Si hay tags, asocialos (requiere relación en base de datos)
  if (Array.isArray(tags) && tags.length > 0) {
    // Relación muchos a muchos: aquí necesitarías insertar en tabla pivote events_tags, si la tienes
    // Este bloque es opcional, depende de tu modelo
  }

  res.status(201).json(newEvent);
});

// ========== EDITAR EVENTO ==========
app.put("/api/event", authenticateToken, async (req, res) => {
  const {
    id,
    name,
    description,
    start_date,
    duration_in_minutes,
    price,
    enabled_for_enrollment,
    max_assistance,
    id_event_location,
    tags,
  } = req.body;
  const id_creator_user = req.user.id;

  if (!id) return res.status(400).json({ message: "ID del evento requerido." });

  // Buscar evento y verificar autoría
  const { data: event, error: eventError } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .single();

  if (eventError || !event) {
    return res.status(404).json({ message: "Evento no encontrado." });
  }
  if (event.id_creator_user !== id_creator_user) {
    return res
      .status(404)
      .json({ message: "El evento no pertenece al usuario autenticado." });
  }

  // Validaciones de negocio
  if (!isValidString(name)) {
    return res
      .status(400)
      .json({
        message: "El campo name es obligatorio y debe tener al menos 3 letras.",
      });
  }
  if (!isValidString(description)) {
    return res
      .status(400)
      .json({
        message:
          "El campo description es obligatorio y debe tener al menos 3 letras.",
      });
  }
  if (!isPositiveNumber(price)) {
    return res
      .status(400)
      .json({ message: "El campo price debe ser mayor o igual a 0." });
  }
  if (!isPositiveNumber(duration_in_minutes)) {
    return res
      .status(400)
      .json({
        message: "El campo duration_in_minutes debe ser mayor o igual a 0.",
      });
  }
  // Validar max_assistance <= max_capacity del event_location
  const { data: eventLoc, error: locError } = await supabase
    .from("event_locations")
    .select("max_capacity")
    .eq("id", id_event_location)
    .single();

  if (locError || !eventLoc) {
    return res
      .status(400)
      .json({ message: "Ubicación del evento no encontrada." });
  }
  if (max_assistance > eventLoc.max_capacity) {
    return res
      .status(400)
      .json({
        message:
          "max_assistance no puede ser mayor que max_capacity de la ubicación.",
      });
  }

  // Actualizar evento
  const { data: updatedEvent, error } = await supabase
    .from("events")
    .update({
      name,
      description,
      start_date,
      duration_in_minutes,
      price,
      enabled_for_enrollment,
      max_assistance,
      id_event_location,
    })
    .eq("id", id)
    .select()
    .single();

  if (error)
    return res.status(500).json({ message: "Error al actualizar el evento." });

  // Manejar actualización de tags si aplica...

  res.status(200).json(updatedEvent);
});

// ========== ELIMINAR EVENTO ==========
app.delete("/api/event/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const id_creator_user = req.user.id;

  // Buscar evento y verificar autoría
  const { data: event, error: eventError } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .single();

  if (eventError || !event) {
    return res.status(404).json({ message: "Evento no encontrado." });
  }
  if (event.id_creator_user !== id_creator_user) {
    return res
      .status(404)
      .json({ message: "El evento no pertenece al usuario autenticado." });
  }

  // Verificar si hay usuarios inscriptos al evento
  const { data: enrolls, error: enrollError } = await supabase
    .from("event_enrollments")
    .select("id")
    .eq("id_event", id);

  if (enrollError) {
    return res
      .status(500)
      .json({ message: "Error al verificar inscripciones." });
  }
  if (enrolls && enrolls.length > 0) {
    return res
      .status(400)
      .json({
        message:
          "No se puede eliminar el evento porque hay usuarios inscriptos.",
      });
  }

  // Eliminar evento
  const { error: deleteError } = await supabase
    .from("events")
    .delete()
    .eq("id", id);

  if (deleteError)
    return res.status(500).json({ message: "Error al eliminar el evento." });

  res.status(200).json({ message: "Evento eliminado correctamente." });
});

app.post("/api/event/:id/enrollment", authenticateToken, async (req, res) => {
  const eventId = parseInt(req.params.id);
  const userId = req.user.id;
  const now = new Date();

  // 1. Buscar el evento
  const { data: event, error: eventError } = await supabase
    .from("events")
    .select("id, start_date, max_assistance, enabled_for_enrollment")
    .eq("id", eventId)
    .single();

  if (eventError || !event) {
    return res.status(404).json({ message: "Evento no encontrado." });
  }

  // 2. Validar fecha: no puede registrarse si el evento ya sucedió o es hoy
  const eventDate = new Date(event.start_date);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (eventDate <= today) {
    return res
      .status(400)
      .json({
        message: "No se puede registrar en un evento que ya sucedió o es hoy.",
      });
  }

  // 3. Validar habilitación
  if (!event.enabled_for_enrollment) {
    return res
      .status(400)
      .json({ message: "El evento no está habilitado para la inscripción." });
  }

  // 4. Validar si ya está registrado
  const { data: existingEnroll, error: enrollError } = await supabase
    .from("event_enrollments")
    .select("id")
    .eq("id_event", eventId)
    .eq("id_user", userId)
    .single();

  if (existingEnroll) {
    return res
      .status(400)
      .json({ message: "El usuario ya está registrado en este evento." });
  }

  // 5. Validar cupo (max_assistance)
  const { data: allEnrollments, error: countError } = await supabase
    .from("event_enrollments")
    .select("id")
    .eq("id_event", eventId);

  if ((allEnrollments?.length || 0) >= event.max_assistance) {
    return res
      .status(400)
      .json({
        message: "Excedida la capacidad máxima de registrados al evento.",
      });
  }

  // 6. Registrar inscripción
  const { data: newEnroll, error: insertError } = await supabase
    .from("event_enrollments")
    .insert([
      {
        id_event: eventId,
        id_user: userId,
        registration_date_time: now.toISOString(),
      },
    ])
    .select()
    .single();

  if (insertError) {
    return res.status(500).json({ message: "Error al registrar inscripción." });
  }

  res.status(201).json(newEnroll);
});

// ========== CANCELAR INSCRIPCIÓN A UN EVENTO ==========
app.delete("/api/event/:id/enrollment", authenticateToken, async (req, res) => {
  const eventId = parseInt(req.params.id);
  const userId = req.user.id;
  const now = new Date();

  // 1. Buscar el evento
  const { data: event, error: eventError } = await supabase
    .from("events")
    .select("id, start_date")
    .eq("id", eventId)
    .single();

  if (eventError || !event) {
    return res.status(404).json({ message: "Evento no encontrado." });
  }

  // 2. Validar fecha: no puede removerse si el evento ya sucedió o es hoy
  const eventDate = new Date(event.start_date);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (eventDate <= today) {
    return res
      .status(400)
      .json({
        message:
          "No puede cancelar inscripción de un evento que ya sucedió o es hoy.",
      });
  }

  // 3. Verificar que el usuario esté inscripto
  const { data: enroll, error: enrollError } = await supabase
    .from("event_enrollments")
    .select("id")
    .eq("id_event", eventId)
    .eq("id_user", userId)
    .single();

  if (!enroll) {
    return res
      .status(400)
      .json({ message: "El usuario no se encuentra registrado al evento." });
  }

  // 4. Eliminar inscripción
  const { error: deleteError } = await supabase
    .from("event_enrollments")
    .delete()
    .eq("id", enroll.id);

  if (deleteError) {
    return res
      .status(500)
      .json({ message: "Error al cancelar la inscripción." });
  }

  res.status(200).json({ message: "Inscripción cancelada correctamente." });
});
app.get("/api/event-location", authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { limit = 15, offset = 0 } = req.query;

  try {
    const { data, error, count } = await supabase
      .from("event_locations")
      .select("*", { count: "exact" })
      .eq("id_creator_user", userId)
      .range(Number(offset), Number(offset) + Number(limit) - 1);

    if (error)
      return res.status(500).json({ message: "Error al obtener ubicaciones." });

    res.status(200).json({
      collection: data,
      pagination: {
        limit: Number(limit),
        offset: Number(offset),
        total: count,
        nextPage:
          Number(offset) + Number(limit) < count
            ? Number(offset) + Number(limit)
            : null,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Error interno", error: err.message });
  }
});

// ========== OBTENER UNA UBICACIÓN DE EVENTO POR ID ==========
app.get("/api/event-location/:id", authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  try {
    const { data, error } = await supabase
      .from("event_locations")
      .select("*")
      .eq("id", id)
      .eq("id_creator_user", userId)
      .single();

    if (error || !data)
      return res
        .status(404)
        .json({
          message: "Ubicación no encontrada o no pertenece al usuario.",
        });

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: "Error interno", error: err.message });
  }
});

// Inicialización del servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
