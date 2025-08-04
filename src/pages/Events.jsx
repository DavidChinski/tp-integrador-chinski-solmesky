import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Filter, Calendar, MapPin, Users, ArrowRight, Star } from 'lucide-react'
import './Events.css'

const Events = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('date')

  const events = [
    {
      id: 1,
      title: 'Conferencia de Tecnología 2024',
      date: '2024-03-15',
      time: '18:00',
      location: 'Centro de Convenciones',
      attendees: 150,
      maxAttendees: 200,
      price: 0,
      category: 'Tecnología',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=250&fit=crop',
      rating: 4.8,
      description: 'La conferencia más importante de tecnología del año con speakers internacionales.'
    },
    {
      id: 2,
      title: 'Workshop de Marketing Digital',
      date: '2024-03-20',
      time: '14:00',
      location: 'Espacio Coworking',
      attendees: 80,
      maxAttendees: 100,
      price: 50,
      category: 'Marketing',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop',
      rating: 4.6,
      description: 'Aprende las mejores estrategias de marketing digital para tu negocio.'
    },
    {
      id: 3,
      title: 'Networking Empresarial',
      date: '2024-03-25',
      time: '19:30',
      location: 'Hotel Premium',
      attendees: 120,
      maxAttendees: 150,
      price: 25,
      category: 'Networking',
      image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=250&fit=crop',
      rating: 4.9,
      description: 'Conecta con profesionales y expande tu red de contactos.'
    },
    {
      id: 4,
      title: 'Concierto de Rock',
      date: '2024-04-01',
      time: '21:00',
      location: 'Estadio Municipal',
      attendees: 5000,
      maxAttendees: 8000,
      price: 80,
      category: 'Entretenimiento',
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=250&fit=crop',
      rating: 4.7,
      description: 'El mejor concierto de rock del año con bandas internacionales.'
    },
    {
      id: 5,
      title: 'Seminario de Liderazgo',
      date: '2024-04-05',
      time: '09:00',
      location: 'Universidad Nacional',
      attendees: 200,
      maxAttendees: 300,
      price: 100,
      category: 'Educación',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop',
      rating: 4.5,
      description: 'Desarrolla tus habilidades de liderazgo con expertos reconocidos.'
    },
    {
      id: 6,
      title: 'Feria de Empleo',
      date: '2024-04-10',
      time: '10:00',
      location: 'Centro de Exposiciones',
      attendees: 800,
      maxAttendees: 1200,
      price: 0,
      category: 'Empleo',
      image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=400&h=250&fit=crop',
      rating: 4.4,
      description: 'Encuentra tu próximo trabajo en la feria más grande del país.'
    }
  ]

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

  const filteredEvents = events
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