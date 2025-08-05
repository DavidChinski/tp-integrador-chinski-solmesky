import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Calendar, MapPin, Users, DollarSign, Star, Share2, Heart, ArrowLeft, Clock } from 'lucide-react'
import { eventsApi } from '../services/api'
import './EventDetail.css'

const EventDetail = () => {
  const { id } = useParams()
  const [event, setEvent] = useState(null)
  const [isRegistered, setIsRegistered] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingEvent, setLoadingEvent] = useState(true)
  const [error, setError] = useState('')

  // Cargar evento desde la API
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoadingEvent(true)
        const eventData = await eventsApi.getEvent(id)
        setEvent(eventData)
        setError('')
      } catch (err) {
        console.error('Error cargando evento:', err)
        setError('Error al cargar el evento')
      } finally {
        setLoadingEvent(false)
      }
    }

    if (id) {
      fetchEvent()
    }
  }, [id])

  // Transformar datos de la API al formato esperado por el componente
  const transformEventData = (apiEvent) => {
    return {
      id: apiEvent.id,
      title: apiEvent.name,
      description: apiEvent.description || 'Sin descripción',
      date: apiEvent.start_date?.split('T')[0] || '',
      time: apiEvent.start_date?.split('T')[1]?.substring(0, 5) || '',
      location: apiEvent.event_location?.name || 'Ubicación no especificada',
      address: apiEvent.event_location?.full_address || '',
      attendees: 0, // TODO: Implementar contador de inscritos
      maxAttendees: apiEvent.max_assistance || 0,
      price: apiEvent.price || 0,
      category: 'Evento',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop',
      rating: 4.5,
      reviews: 0,
      organizer: {
        name: `${apiEvent.creator_user?.first_name || ''} ${apiEvent.creator_user?.last_name || ''}`.trim() || 'Organizador',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        verified: true
      },
      speakers: [], // TODO: Implementar speakers
      agenda: [] // TODO: Implementar agenda
    }
  }

  const eventData = event ? transformEventData(event) : null

  const getAttendancePercentage = () => {
    if (!eventData) return 0
    return Math.round((eventData.attendees / eventData.maxAttendees) * 100)
  }

  const handleRegister = async () => {
    if (!eventData) return
    
    setIsLoading(true)
    
    try {
      await eventsApi.enrollEvent(eventData.id)
      setIsRegistered(true)
    } catch (error) {
      console.error('Error al registrarse:', error)
      alert('Error al registrarse al evento')
    } finally {
      setIsLoading(false)
    }
  }

  const handleShare = () => {
    if (!eventData) return
    
    if (navigator.share) {
      navigator.share({
        title: eventData.title,
        text: eventData.description,
        url: window.location.href
      })
    } else {
      // Fallback: copiar al portapapeles
      navigator.clipboard.writeText(window.location.href)
      alert('Enlace copiado al portapapeles')
    }
  }

  // Loading state
  if (loadingEvent) {
    return (
      <div className="event-detail-page">
        <div className="event-detail-container">
          <div className="loading-state">
            <p>Cargando evento...</p>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !eventData) {
    return (
      <div className="event-detail-page">
        <div className="event-detail-container">
          <div className="error-state">
            <p>{error || 'Evento no encontrado'}</p>
            <Link to="/events" className="btn btn-primary">
              Volver a Eventos
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="event-detail-page">
      <div className="event-detail-container">
        {/* Header con navegación */}
        <div className="event-header">
          <Link to="/events" className="back-button">
            <ArrowLeft />
            Volver a Eventos
          </Link>
          <div className="event-actions">
            <button className="action-btn" onClick={handleShare}>
              <Share2 />
            </button>
            <button className="action-btn">
              <Heart />
            </button>
          </div>
        </div>

        {/* Imagen principal */}
        <div className="event-hero">
          <div className="event-image">
            <img src={eventData.image} alt={eventData.title} />
            <div className="event-category">{eventData.category}</div>
            {eventData.price === 0 && (
              <div className="event-free">Gratis</div>
            )}
          </div>
        </div>

        <div className="event-content">
          <div className="event-main">
            {/* Información principal */}
            <div className="event-info">
              <div className="event-header-info">
                <h1 className="event-title">{eventData.title}</h1>
                <div className="event-rating">
                  <Star className="star-icon" />
                  <span>{eventData.rating}</span>
                  <span className="reviews-count">({eventData.reviews} reseñas)</span>
                </div>
              </div>

              <p className="event-description">{eventData.description}</p>

              {/* Organizador */}
              <div className="organizer-info">
                <div className="organizer-avatar">
                  <img src={eventData.organizer.avatar} alt={eventData.organizer.name} />
                  {eventData.organizer.verified && (
                    <div className="verified-badge">✓</div>
                  )}
                </div>
                <div className="organizer-details">
                  <h3>Organizado por</h3>
                  <p className="organizer-name">{eventData.organizer.name}</p>
                </div>
              </div>
            </div>

            {/* Detalles del evento */}
            <div className="event-details">
              <div className="detail-item">
                <Calendar className="detail-icon" />
                <div className="detail-content">
                  <h4>Fecha y Hora</h4>
                  <p>{eventData.date} • {eventData.time}</p>
                </div>
              </div>

              <div className="detail-item">
                <MapPin className="detail-icon" />
                <div className="detail-content">
                  <h4>Ubicación</h4>
                  <p>{eventData.location}</p>
                  <span className="address">{eventData.address}</span>
                </div>
              </div>

              <div className="detail-item">
                <Users className="detail-icon" />
                <div className="detail-content">
                  <h4>Asistentes</h4>
                  <p>{eventData.attendees}/{eventData.maxAttendees} registrados</p>
                  <div className="attendance-bar">
                    <div 
                      className="attendance-fill"
                      style={{ width: `${getAttendancePercentage()}%` }}
                    ></div>
                  </div>
                  <span className="attendance-text">{getAttendancePercentage()}% lleno</span>
                </div>
              </div>

              <div className="detail-item">
                <DollarSign className="detail-icon" />
                <div className="detail-content">
                  <h4>Precio</h4>
                  <p>{eventData.price === 0 ? 'Gratis' : `$${eventData.price}`}</p>
                </div>
              </div>
            </div>

            {/* Speakers */}
            {eventData.speakers.length > 0 && (
              <div className="speakers-section">
                <h2>Speakers</h2>
                <div className="speakers-grid">
                  {eventData.speakers.map((speaker, index) => (
                    <div key={index} className="speaker-card">
                      <img src={speaker.avatar} alt={speaker.name} className="speaker-avatar" />
                      <div className="speaker-info">
                        <h3>{speaker.name}</h3>
                        <p>{speaker.title}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Agenda */}
            {eventData.agenda.length > 0 && (
              <div className="agenda-section">
                <h2>Agenda</h2>
                <div className="agenda-list">
                  {eventData.agenda.map((item, index) => (
                    <div key={index} className="agenda-item">
                      <div className="agenda-time">
                        <Clock className="agenda-icon" />
                        <span>{item.time}</span>
                      </div>
                      <div className="agenda-content">
                        <h3>{item.title}</h3>
                        <p>{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar con registro */}
          <div className="event-sidebar">
            <div className="registration-card">
              <div className="price-info">
                <span className="price">{eventData.price === 0 ? 'Gratis' : `$${eventData.price}`}</span>
                <span className="price-label">por persona</span>
              </div>

              <div className="registration-status">
                <div className="status-item">
                  <Users className="status-icon" />
                  <span>{eventData.attendees} de {eventData.maxAttendees} asistentes</span>
                </div>
                <div className="status-item">
                  <Calendar className="status-icon" />
                  <span>Faltan 15 días</span>
                </div>
              </div>

              {isRegistered ? (
                <div className="registered-status">
                  <div className="success-message">
                    ✓ Ya estás registrado
                  </div>
                  <button className="btn btn-secondary">
                    Ver Ticket
                  </button>
                </div>
              ) : (
                <button
                  className={`btn btn-primary register-btn ${isLoading ? 'loading' : ''}`}
                  onClick={handleRegister}
                  disabled={isLoading || getAttendancePercentage() >= 100}
                >
                  {isLoading ? 'Registrando...' : 'Registrarse'}
                </button>
              )}

              {getAttendancePercentage() >= 100 && (
                <div className="sold-out">
                  Evento completo
                </div>
              )}

              <div className="event-policies">
                <h4>Políticas del evento</h4>
                <ul>
                  <li>Cancelación gratuita hasta 24h antes</li>
                  <li>Reembolso completo disponible</li>
                  <li>Transferencia de ticket permitida</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventDetail 