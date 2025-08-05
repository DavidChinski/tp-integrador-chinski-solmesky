import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, Filter, Calendar, MapPin, Users, ArrowRight, Star } from 'lucide-react'
import { eventsApi } from '../services/api'
import './Events.css'

const Events = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('date')
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Cargar eventos desde la API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true)
        const params = {}
        if (searchTerm) params.name = searchTerm
        
        const data = await eventsApi.getEvents(params)
        setEvents(data.collection || [])
        setError('')
      } catch (err) {
        console.error('Error cargando eventos:', err)
        setError('Error al cargar los eventos')
        setEvents([])
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [searchTerm])

  // Transformar datos de la API al formato esperado por el componente
  const transformEventData = (apiEvent) => {
    return {
      id: apiEvent.id,
      title: apiEvent.name,
      date: apiEvent.start_date?.split('T')[0] || '',
      time: apiEvent.start_date?.split('T')[1]?.substring(0, 5) || '',
      location: apiEvent.event_location?.name || 'Ubicación no especificada',
      attendees: 0, // TODO: Implementar contador de inscritos
      maxAttendees: apiEvent.max_assistance || 0,
      price: apiEvent.price || 0,
      category: 'Evento', // TODO: Implementar categorías
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=250&fit=crop', // Imagen por defecto
      rating: 4.5, // TODO: Implementar sistema de ratings
      description: apiEvent.description || 'Sin descripción'
    }
  }

  const categories = [
    { value: 'all', label: 'Todas las categorías' },
    { value: 'Tecnología', label: 'Tecnología' },
    { value: 'Marketing', label: 'Marketing' },
    { value: 'Networking', label: 'Networking' },
    { value: 'Entretenimiento', label: 'Entretenimiento' },
    { value: 'Educación', label: 'Educación' },
    { value: 'Empleo', label: 'Empleo' }
  ]

  const sortOptions = [
    { value: 'date', label: 'Fecha' },
    { value: 'price', label: 'Precio' },
    { value: 'rating', label: 'Calificación' },
    { value: 'attendees', label: 'Asistentes' }
  ]

  const transformedEvents = events.map(transformEventData)
  
  const filteredEvents = transformedEvents
    .filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          event.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(a.date) - new Date(b.date)
        case 'price':
          return a.price - b.price
        case 'rating':
          return b.rating - a.rating
        case 'attendees':
          return b.attendees - a.attendees
        default:
          return 0
      }
    })

  const getAttendancePercentage = (attendees, maxAttendees) => {
    return Math.round((attendees / maxAttendees) * 100)
  }

  return (
    <div className="events-page">
      <div className="page-header">
        <h1 className="page-title">Explorar Eventos</h1>
        <p className="page-subtitle">Descubre eventos increíbles y únete a la comunidad</p>
      </div>

      {/* Filters and Search */}
      <div className="filters-section">
        <div className="search-container">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Buscar eventos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filters-container">
          <div className="filter-group">
            <Filter className="filter-icon" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="filter-select"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <span>Ordenar por:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="filter-select"
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="results-count">
        <p>{filteredEvents.length} eventos encontrados</p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="loading-state">
          <p>Cargando eventos...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="error-state">
          <p>{error}</p>
        </div>
      )}

      {/* Events Grid */}
      <div className="events-grid">
        {filteredEvents.map((event) => (
          <div key={event.id} className="event-card">
            <div className="event-image">
              <img src={event.image} alt={event.title} />
              <div className="event-category">{event.category}</div>
              {event.price === 0 && (
                <div className="event-free">Gratis</div>
              )}
            </div>
            
            <div className="event-content">
              <div className="event-header">
                <h3 className="event-title">{event.title}</h3>
                <div className="event-rating">
                  <Star className="star-icon" />
                  <span>{event.rating}</span>
                </div>
              </div>
              
              <p className="event-description">{event.description}</p>
              
              <div className="event-meta">
                <div className="event-meta-item">
                  <Calendar className="event-meta-icon" />
                  <span>{event.date} • {event.time}</span>
                </div>
                <div className="event-meta-item">
                  <MapPin className="event-meta-icon" />
                  <span>{event.location}</span>
                </div>
                <div className="event-meta-item">
                  <Users className="event-meta-icon" />
                  <span>{event.attendees}/{event.maxAttendees} asistentes</span>
                </div>
              </div>

              <div className="event-footer">
                <div className="event-price">
                  {event.price === 0 ? 'Gratis' : `$${event.price}`}
                </div>
                
                <div className="event-attendance">
                  <div className="attendance-bar">
                    <div 
                      className="attendance-fill"
                      style={{ width: `${getAttendancePercentage(event.attendees, event.maxAttendees)}%` }}
                    ></div>
                  </div>
                  <span className="attendance-text">
                    {getAttendancePercentage(event.attendees, event.maxAttendees)}% lleno
                  </span>
                </div>

                <Link to={`/events/${event.id}`} className="event-link">
                  Ver Detalles
                  <ArrowRight className="event-link-icon" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="no-results">
          <h3>No se encontraron eventos</h3>
          <p>Intenta ajustar tus filtros de búsqueda</p>
        </div>
      )}
    </div>
  )
}

export default Events 