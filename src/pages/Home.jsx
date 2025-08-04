import React from 'react'
import { Link } from 'react-router-dom'
import { Calendar, Users, MapPin, Clock, ArrowRight, Star, TrendingUp } from 'lucide-react'
import './Home.css'

const Home = () => {
  const featuredEvents = [
    {
      id: 1,
      title: 'Conferencia de Tecnología 2024',
      date: '2024-03-15',
      time: '18:00',
      location: 'Centro de Convenciones',
      attendees: 150,
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=250&fit=crop',
      category: 'Tecnología'
    },
    {
      id: 2,
      title: 'Workshop de Marketing Digital',
      date: '2024-03-20',
      time: '14:00',
      location: 'Espacio Coworking',
      attendees: 80,
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=250&fit=crop',
      category: 'Marketing'
    },
    {
      id: 3,
      title: 'Networking Empresarial',
      date: '2024-03-25',
      time: '19:30',
      location: 'Hotel Premium',
      attendees: 120,
      image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=250&fit=crop',
      category: 'Networking'
    }
  ]

  const stats = [
    { icon: Calendar, value: '500+', label: 'Eventos Creados' },
    { icon: Users, value: '10K+', label: 'Usuarios Registrados' },
    { icon: MapPin, value: '50+', label: 'Ciudades' },
    { icon: Star, value: '4.8', label: 'Calificación' }
  ]

  const features = [
    {
      icon: Calendar,
      title: 'Crear Eventos Fácilmente',
      description: 'Crea y gestiona tus eventos de manera intuitiva con nuestra plataforma.'
    },
    {
      icon: Users,
      title: 'Gestionar Asistentes',
      description: 'Controla las inscripciones y mantén un registro detallado de participantes.'
    },
    {
      icon: MapPin,
      title: 'Ubicaciones Múltiples',
      description: 'Organiza eventos en diferentes ubicaciones con herramientas de localización.'
    },
    {
      icon: TrendingUp,
      title: 'Analytics en Tiempo Real',
      description: 'Obtén insights valiosos sobre el rendimiento de tus eventos.'
    }
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
          <div className="hero-buttons">
            <Link to="/create-event" className="btn btn-primary">
              Crear Evento
              <ArrowRight className="btn-icon" />
            </Link>
            <Link to="/events" className="btn btn-secondary">
              Explorar Eventos
            </Link>
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
          <p>Descubre los eventos más populares y próximos</p>
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
                    <span>{event.attendees} asistentes</span>
                  </div>
                </div>
                <Link to={`/events/${event.id}`} className="event-link">
                  Ver Detalles
                  <ArrowRight className="event-link-icon" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="section-header">
          <h2>¿Por qué elegirnos?</h2>
          <p>Descubre todas las funcionalidades que ofrecemos</p>
        </div>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">
                <feature.icon />
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="cta-content">
          <h2>¿Listo para crear tu primer evento?</h2>
          <p>Únete a miles de organizadores que ya confían en nuestra plataforma</p>
          <div className="cta-buttons">
            <Link to="/register" className="btn btn-primary">
              Registrarse Gratis
            </Link>
            <Link to="/events" className="btn btn-secondary">
              Ver Eventos
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home 