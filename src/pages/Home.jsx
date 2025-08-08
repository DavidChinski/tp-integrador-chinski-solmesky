import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Users, MapPin, Clock, ArrowRight, Star, TrendingUp } from 'lucide-react'
import './Home.css'
import { eventsApi } from '../services/api'

const Home = () => {
  const [featuredEvents, setFeaturedEvents] = useState([])

  useEffect(() => {
    const load = async () => {
      try {
        const data = await eventsApi.getEvents({ limit: 6, offset: 0 })
        const mapped = (data.collection || []).map(ev => ({
          id: ev.id,
          title: ev.name,
          date: new Date(ev.start_date).toLocaleDateString(),
          time: new Date(ev.start_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          location: ev?.event_location?.name || 'Sin ubicación',
          attendees: ev.max_assistance || 0,
          image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=250&fit=crop',
          category: 'Evento'
        }))
        setFeaturedEvents(mapped)
      } catch (_) {
        setFeaturedEvents([])
      }
    }
    load()
  }, [])

  const stats = [
    { value: '250+', label: 'Eventos Activos', icon: Calendar },
    { value: '10k+', label: 'Usuarios Registrados', icon: Users },
    { value: '120+', label: 'Ubicaciones', icon: MapPin },
    { value: '98%', label: 'Satisfacción', icon: Star }
  ]

  const features = [
    { icon: Calendar,  title: 'Crear Eventos Fácilmente',      description: 'Crea y gestiona tus eventos de manera intuitiva con nuestra plataforma.' },
    { icon: Users,     title: 'Gestionar Asistentes',          description: 'Controla las inscripciones y mantén un registro detallado de participantes.' },
    { icon: MapPin,    title: 'Ubicaciones Múltiples',         description: 'Organiza eventos en diferentes ubicaciones con herramientas de localización.' },
    { icon: TrendingUp,title: 'Analytics en Tiempo Real',      description: 'Obtén insights valiosos sobre el rendimiento de tus eventos.' }
  ]

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Gestiona tus eventos de manera
            <span className="gradient-text"> profesional</span>
          </h1>
          <p className="hero-subtitle">
            Crea, organiza y gestiona eventos de todo tipo con nuestra plataforma intuitiva y completa.
            Conecta con tu audiencia de manera efectiva.
          </p>
          <div className="hero-actions">
            <Link to="/events" className="btn btn-primary">Explorar Eventos</Link>
            <Link to="/create-event" className="btn btn-outline">Crear Evento</Link>
          </div>
        </div>

        <div className="hero-image">
          <div className="hero-card">
            <div className="hero-card-header">
              <Calendar className="hero-card-icon" />
              <span>Próximos Eventos</span>
            </div>
            <div className="hero-card-content">
              {featuredEvents.slice(0, 2).map((event) => (
                <div key={event.id} className="hero-event-item">
                  <div className="hero-event-info">
                    <h4>{event.title}</h4>
                    <div className="hero-event-meta">
                      <span>{event.date}</span>
                      <span>•</span>
                      <span>{event.time}</span>
                    </div>
                    <div className="hero-event-location">
                      <MapPin className="hero-location-icon" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                  <div className="hero-event-attendees">
                    <Users className="hero-attendees-icon" />
                    <span>{event.attendees}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <stat.icon className="stat-icon" />
              <div className="stat-content">
                <h3 className="stat-value">{stat.value}</h3>
                <p className="stat-label">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Events */}
      <section className="featured-events">
        <div className="section-header">
          <h2>Eventos Destacados</h2>
          <Link to="/events" className="view-all">
            Ver todos <ArrowRight className="view-all-icon" />
          </Link>
        </div>

        <div className="events-grid">
          {featuredEvents.map((event) => (
            <div key={event.id} className="event-card">
              <div className="event-image">
                <img src={event.image} alt={event.title} />
                <div className="event-category">{event.category}</div>
              </div>
              <div className="event-content">
                <h3 className="event-title">{event.title}</h3>
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
                    <span>{event.attendees} cupos</span>
                  </div>
                </div>
                <div className="event-actions">
                  <Link to={`/events/${event.id}`} className="btn btn-secondary">
                    Ver Detalles
                  </Link>
                </div>
              </div>
            </div>
          ))}
          {featuredEvents.length === 0 && (
            <div className="no-events">
              <p>No hay eventos disponibles.</p>
            </div>
          )}
        </div>
      </section>

      {/* Features */}
      <section className="features">
        <div className="features-grid">
          {features.map((feature, idx) => (
            <div key={idx} className="feature-card">
              <feature.icon className="feature-icon" />
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
        <div className="cta">
          <h3>¿Listo para empezar?</h3>
          <div className="cta-buttons">
            <Link to="/register" className="btn btn-primary">Registrarse Gratis</Link>
            <Link to="/events" className="btn btn-secondary">Ver Eventos</Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
