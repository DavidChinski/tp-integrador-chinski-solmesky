import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Calendar, MapPin, Users, DollarSign, Star, Share2, Heart, ArrowLeft, Clock } from 'lucide-react'
import './EventDetail.css'

const EventDetail = () => {
  const { id } = useParams()
  const [isRegistered, setIsRegistered] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Simular datos del evento (en una app real vendría de una API)
  const event = {
    id: id,
    title: 'Conferencia de Tecnología 2024',
    description: 'La conferencia más importante de tecnología del año con speakers internacionales. Descubre las últimas tendencias en desarrollo, inteligencia artificial, y transformación digital. Una oportunidad única para conectar con expertos de la industria y expandir tu red profesional.',
    date: '2024-03-15',
    time: '18:00',
    location: 'Centro de Convenciones',
    address: 'Av. Principal 123, Ciudad',
    attendees: 150,
    maxAttendees: 200,
    price: 0,
    category: 'Tecnología',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=400&fit=crop',
    rating: 4.8,
    reviews: 45,
    organizer: {
      name: 'Tech Events Inc.',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      verified: true
    },
    speakers: [
      {
        name: 'Dr. Ana García',
        title: 'CEO, TechCorp',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face'
      },
      {
        name: 'Carlos Rodríguez',
        title: 'CTO, InnovateLab',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face'
      },
      {
        name: 'María López',
        title: 'Lead Developer, CodeFlow',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
      }
    ],
    agenda: [
      {
        time: '18:00 - 18:30',
        title: 'Registro y Networking',
        description: 'Tiempo para registrarse y conectar con otros asistentes'
      },
      {
        time: '18:30 - 19:15',
        title: 'Keynote: El Futuro de la IA',
        description: 'Dr. Ana García compartirá su visión sobre el futuro de la inteligencia artificial'
      },
      {
        time: '19:15 - 20:00',
        title: 'Panel: Desarrollo Sostenible',
        description: 'Discusión sobre cómo la tecnología puede ayudar al medio ambiente'
      },
      {
        time: '20:00 - 21:00',
        title: 'Networking y Cócteles',
        description: 'Tiempo para conectar con speakers y otros profesionales'
      }
    ]
  }

  const getAttendancePercentage = () => {
    return Math.round((event.attendees / event.maxAttendees) * 100)
  }

  const handleRegister = async () => {
    setIsLoading(true)
    
    // Simular registro
    setTimeout(() => {
      setIsRegistered(true)
      setIsLoading(false)
    }, 1000)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.title,
        text: event.description,
        url: window.location.href
      })
    } else {
      // Fallback: copiar al portapapeles
      navigator.clipboard.writeText(window.location.href)
      alert('Enlace copiado al portapapeles')
    }
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
            <img src={event.image} alt={event.title} />
            <div className="event-category">{event.category}</div>
            {event.price === 0 && (
              <div className="event-free">Gratis</div>
            )}
          </div>
        </div>

        <div className="event-content">
          <div className="event-main">
            {/* Información principal */}
            <div className="event-info">
              <div className="event-header-info">
                <h1 className="event-title">{event.title}</h1>
                <div className="event-rating">
                  <Star className="star-icon" />
                  <span>{event.rating}</span>
                  <span className="reviews-count">({event.reviews} reseñas)</span>
                </div>
              </div>

              <p className="event-description">{event.description}</p>

              {/* Organizador */}
              <div className="organizer-info">
                <div className="organizer-avatar">
                  <img src={event.organizer.avatar} alt={event.organizer.name} />
                  {event.organizer.verified && (
                    <div className="verified-badge">✓</div>
                  )}
                </div>
                <div className="organizer-details">
                  <h3>Organizado por</h3>
                  <p className="organizer-name">{event.organizer.name}</p>
                </div>
              </div>
            </div>

            {/* Detalles del evento */}
            <div className="event-details">
              <div className="detail-item">
                <Calendar className="detail-icon" />
                <div className="detail-content">
                  <h4>Fecha y Hora</h4>
                  <p>{event.date} • {event.time}</p>
                </div>
              </div>

              <div className="detail-item">
                <MapPin className="detail-icon" />
                <div className="detail-content">
                  <h4>Ubicación</h4>
                  <p>{event.location}</p>
                  <span className="address">{event.address}</span>
                </div>
              </div>

              <div className="detail-item">
                <Users className="detail-icon" />
                <div className="detail-content">
                  <h4>Asistentes</h4>
                  <p>{event.attendees}/{event.maxAttendees} registrados</p>
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
                  <p>{event.price === 0 ? 'Gratis' : `$${event.price}`}</p>
                </div>
              </div>
            </div>

            {/* Speakers */}
            <div className="speakers-section">
              <h2>Speakers</h2>
              <div className="speakers-grid">
                {event.speakers.map((speaker, index) => (
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

            {/* Agenda */}
            <div className="agenda-section">
              <h2>Agenda</h2>
              <div className="agenda-list">
                {event.agenda.map((item, index) => (
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
          </div>

          {/* Sidebar con registro */}
          <div className="event-sidebar">
            <div className="registration-card">
              <div className="price-info">
                <span className="price">{event.price === 0 ? 'Gratis' : `$${event.price}`}</span>
                <span className="price-label">por persona</span>
              </div>

              <div className="registration-status">
                <div className="status-item">
                  <Users className="status-icon" />
                  <span>{event.attendees} de {event.maxAttendees} asistentes</span>
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