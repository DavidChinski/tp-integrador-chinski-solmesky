# EventManager - Frontend React.js

Esta es la aplicación frontend de EventManager desarrollada en React.js, conectada a un backend Node.js con base de datos Supabase.

## Características

- ✅ **Autenticación completa**: Login, registro y gestión de sesiones
- ✅ **Gestión de eventos**: Ver, crear, editar y eliminar eventos
- ✅ **Inscripciones**: Registrarse y cancelar inscripciones a eventos
- ✅ **Gestión de ubicaciones**: Crear y gestionar ubicaciones para eventos
- ✅ **Diseño responsivo**: Interfaz moderna y adaptable
- ✅ **Protección de rutas**: Rutas protegidas para usuarios autenticados

## Requisitos Previos

- Node.js (versión 16 o superior)
- npm o yarn
- Backend corriendo en `http://localhost:3000`
- Base de datos Supabase configurada

## Instalación

1. **Clonar el repositorio** (si no lo has hecho ya):
```bash
git clone <url-del-repositorio>
cd Hola
```

2. **Instalar dependencias**:
```bash
npm install
```

3. **Configurar variables de entorno**:
Crea un archivo `.env` en la raíz del proyecto:
```env
VITE_API_URL=http://localhost:3000/api
```

## Ejecutar la Aplicación

1. **Asegúrate de que el backend esté corriendo**:
```bash
# En otra terminal, desde la carpeta del backend
node server.js
```

2. **Iniciar el frontend**:
```bash
npm run dev
```

3. **Abrir en el navegador**:
La aplicación estará disponible en `http://localhost:5173`

## Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── Navbar.jsx      # Barra de navegación
│   └── ProtectedRoute.jsx # Protección de rutas
├── contexts/           # Contextos de React
│   └── AuthContext.jsx # Contexto de autenticación
├── pages/              # Páginas de la aplicación
│   ├── Home.jsx        # Página de inicio
│   ├── Events.jsx      # Lista de eventos
│   ├── EventDetail.jsx # Detalle de evento
│   ├── CreateEvent.jsx # Crear evento
│   ├── Login.jsx       # Página de login
│   ├── Register.jsx    # Página de registro
│   └── Profile.jsx     # Perfil de usuario
├── services/           # Servicios de API
│   └── api.js          # Funciones de comunicación con backend
└── App.jsx             # Componente principal
```

## Funcionalidades Principales

### Autenticación
- **Login**: Los usuarios pueden iniciar sesión con email y contraseña
- **Registro**: Los usuarios pueden crear nuevas cuentas
- **Sesión persistente**: El token se guarda en localStorage
- **Logout**: Cerrar sesión y limpiar datos

### Eventos
- **Lista de eventos**: Ver todos los eventos disponibles
- **Filtros**: Buscar por nombre y filtrar por categoría
- **Detalle de evento**: Ver información completa de un evento
- **Inscripción**: Registrarse a eventos (requiere autenticación)
- **Crear evento**: Crear nuevos eventos (requiere autenticación)

### Ubicaciones
- **Gestión de ubicaciones**: Los usuarios pueden crear ubicaciones para sus eventos
- **Selección de ubicación**: Al crear eventos, se selecciona de las ubicaciones disponibles

## API Endpoints Utilizados

### Autenticación
- `POST /api/user/login` - Iniciar sesión
- `POST /api/user/register` - Registrar usuario
- `GET /api/user/verify` - Verificar token

### Eventos
- `GET /api/event` - Obtener lista de eventos
- `GET /api/event/:id` - Obtener detalle de evento
- `POST /api/event` - Crear evento
- `PUT /api/event` - Actualizar evento
- `DELETE /api/event/:id` - Eliminar evento
- `POST /api/event/:id/enrollment` - Inscribirse a evento
- `DELETE /api/event/:id/enrollment` - Cancelar inscripción

### Ubicaciones
- `GET /api/event-location` - Obtener ubicaciones del usuario
- `POST /api/event-location` - Crear ubicación
- `PUT /api/event-location/:id` - Actualizar ubicación
- `DELETE /api/event-location/:id` - Eliminar ubicación

## Tecnologías Utilizadas

- **React.js**: Framework principal
- **React Router**: Navegación entre páginas
- **Context API**: Gestión de estado global
- **Fetch API**: Comunicación con backend
- **CSS Modules**: Estilos modulares
- **Lucide React**: Iconos

## Notas Importantes

1. **Backend requerido**: La aplicación necesita el backend corriendo en `http://localhost:3000`
2. **Base de datos**: Asegúrate de que Supabase esté configurado correctamente
3. **CORS**: El backend debe tener CORS habilitado para permitir requests desde el frontend
4. **Autenticación**: Algunas rutas requieren autenticación (CreateEvent, Profile)

## Solución de Problemas

### Error de conexión al backend
- Verifica que el backend esté corriendo en `http://localhost:3000`
- Revisa la consola del navegador para errores de CORS

### Error de autenticación
- Verifica que el token se esté guardando correctamente en localStorage
- Revisa que el endpoint `/api/user/verify` esté funcionando

### Error al cargar eventos
- Verifica que la base de datos tenga datos de eventos
- Revisa la consola para errores específicos de la API

## Desarrollo

Para desarrollo adicional:

1. **Modo desarrollo**: `npm run dev`
2. **Build de producción**: `npm run build`
3. **Preview de build**: `npm run preview`

## Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request 