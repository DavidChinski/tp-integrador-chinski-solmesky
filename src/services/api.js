const API_BASE_URL = 'http://localhost:3000/api'

// Función helper para hacer requests con autenticación
const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token')
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers
    },
    ...options
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config)
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || 'Error en la petición')
    }
    
    return data
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}

// Eventos
export const eventsApi = {
  // Obtener lista de eventos
  getEvents: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString()
    return apiRequest(`/event?${queryParams}`)
  },

  // Obtener detalle de un evento
  getEvent: async (id) => {
    return apiRequest(`/event/${id}`)
  },

  // Obtener participantes de un evento
  getEventParticipants: async (id, params = {}) => {
    const queryParams = new URLSearchParams(params).toString()
    return apiRequest(`/event/${id}/participants?${queryParams}`)
  },

  // Crear evento
  createEvent: async (eventData) => {
    return apiRequest('/event', {
      method: 'POST',
      body: JSON.stringify(eventData)
    })
  },

  // Actualizar evento
  updateEvent: async (eventData) => {
    return apiRequest('/event', {
      method: 'PUT',
      body: JSON.stringify(eventData)
    })
  },

  // Eliminar evento
  deleteEvent: async (id) => {
    return apiRequest(`/event/${id}`, {
      method: 'DELETE'
    })
  },

  // Inscribirse a un evento
  enrollEvent: async (id) => {
    return apiRequest(`/event/${id}/enrollment`, {
      method: 'POST'
    })
  },

  // Cancelar inscripción a un evento
  cancelEnrollment: async (id) => {
    return apiRequest(`/event/${id}/enrollment`, {
      method: 'DELETE'
    })
  }
}

// Ubicaciones
export const locationsApi = {
  // Obtener ubicaciones del usuario
  getLocations: async (params = {}) => {
    const queryParams = new URLSearchParams(params).toString()
    return apiRequest(`/event-location?${queryParams}`)
  },

  // Obtener detalle de ubicación
  getLocation: async (id) => {
    return apiRequest(`/event-location/${id}`)
  },

  // Crear ubicación
  createLocation: async (locationData) => {
    return apiRequest('/event-location', {
      method: 'POST',
      body: JSON.stringify(locationData)
    })
  },

  // Actualizar ubicación
  updateLocation: async (id, locationData) => {
    return apiRequest(`/event-location/${id}`, {
      method: 'PUT',
      body: JSON.stringify(locationData)
    })
  },

  // Eliminar ubicación
  deleteLocation: async (id) => {
    return apiRequest(`/event-location/${id}`, {
      method: 'DELETE'
    })
  }
}

// Autenticación
export const authApi = {
  // Login
  login: async (credentials) => {
    return apiRequest('/user/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    })
  },

  // Registro
  register: async (userData) => {
    return apiRequest('/user/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    })
  }
} 