// src/services/api.js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

// Helper con token automático
const apiRequest = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token')

  const config = {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    body: options.body,
  }

  const res = await fetch(`${API_BASE_URL}${endpoint}`, config)
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    // Propagar error legible
    const message = data?.message || 'Error de servidor'
    const error = new Error(message)
    error.status = res.status
    error.body = data
    throw error
  }
  return data
}

// ==== Eventos ====
export const eventsApi = {
  getEvents: async (params = {}) => {
    const qs = new URLSearchParams(params).toString()
    return apiRequest(`/event?${qs}`)
  },
  getEvent: async (id) => apiRequest(`/event/${id}`),
  getParticipants: async (id, { limit = 15, offset = 0 } = {}) =>
    apiRequest(`/event/${id}/participants?${new URLSearchParams({ limit, offset })}`),
  enrollEvent: async (id) =>
    apiRequest(`/event/${id}/enrollment`, { method: 'POST' }),
  cancelEnrollment: async (id) =>
    apiRequest(`/event/${id}/enrollment`, { method: 'DELETE' }),

  createEvent: async (eventData) =>
    apiRequest('/event', { method: 'POST', body: JSON.stringify(eventData) }),
  updateEvent: async (eventData) =>
    apiRequest('/event', { method: 'PUT', body: JSON.stringify(eventData) }),
  deleteEvent: async (id) =>
    apiRequest(`/event/${id}`, { method: 'DELETE' }),
}

// ==== Ubicaciones ====
export const locationsApi = {
  getLocations: async ({ limit = 15, offset = 0 } = {}) =>
    apiRequest(`/event-location?${new URLSearchParams({ limit, offset })}`),
  getLocation: async (id) => apiRequest(`/event-location/${id}`),
  createLocation: async (payload) =>
    apiRequest('/event-location', { method: 'POST', body: JSON.stringify(payload) }),
  updateLocation: async (id, payload) =>
    apiRequest(`/event-location/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteLocation: async (id) =>
    apiRequest(`/event-location/${id}`, { method: 'DELETE' }),
}

// ==== Auth ====
export const authApi = {
  login: async ({ username, password }) =>
    apiRequest('/user/login', { method: 'POST', body: JSON.stringify({ username, password }) }),
  register: async (userData) =>
    apiRequest('/user/register', { method: 'POST', body: JSON.stringify(userData) }),
}
