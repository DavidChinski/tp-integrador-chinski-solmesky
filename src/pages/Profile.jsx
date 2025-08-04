import React, { useState } from 'react'
import { User, Mail, Phone, Calendar, MapPin, Edit, Settings, LogOut, Plus } from 'lucide-react'
import './Profile.css'

const Profile = () => {
  const [activeTab, setActiveTab] = useState('profile')
  const [isEditing, setIsEditing] = useState(false)

  // Datos simulados del usuario
  const user = {
    name: 'Juan Pérez',
    email: 'juan.perez@email.com',
    phone: '+1 (555) 123-4567',
    location: 'Ciudad de México, México',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
    bio: 'Organizador de eventos apasionado por conectar personas y crear experiencias únicas.',
    eventsCreated: 12,
    eventsAttended: 45,
    memberSince: '2023'
  }

  const userEvents = [
    {
      id: 1,
      title: 'Conferencia de Tecnología 2024',
      date: '2024-03-15',
      status: 'upcoming',
      attendees: 150,
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=300&h=200&fit=crop'
    },
    {
      id: 2,
      title: 'Workshop de Marketing Digital',
      date: '2024-02-20',
      status: 'completed',
      attendees: 80,
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=300&h=200&fit=crop'
    },
    {
      id: 3,
      title: 'Networking Empresarial',
      date: '2024-04-10',
      status: 'upcoming',
      attendees: 120,
      image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=300&h=200&fit=crop'
    }
  ]

  const attendedEvents = [
    {
      id: 4,
      title: 'Seminario de Liderazgo',
      date: '2024-01-15',
      status: 'completed',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=200&fit=crop'
    },
    {
      id: 5,
      title: 'Feria de Empleo',
      date: '2024-01-10',
      status: 'completed',
      rating: 4,
      image: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=300&h=200&fit=crop'
    }
  ]

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'events', label: 'Mis Eventos', icon: Calendar },
    { id: 'attended', label: 'Eventos Asistidos', icon: Calendar },
    { id: 'settings', label: 'Configuración', icon: Settings }
  ]

  const getStatusBadge = (status) => {
    const statusConfig = {
      upcoming: { label: 'Próximo', class: 'status-upcoming' },
      completed: { label: 'Completado', class: 'status-completed' },
      cancelled: { label: 'Cancelado', class: 'status-cancelled' }
    }
    
    const config = statusConfig[status]
    return (
      <span className={`status-badge ${config.class}`}>
        {config.label}
      </span>
    )
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Header del perfil */}
        <div className="profile-header">
          <div className="profile-avatar">
            <img src={user.avatar} alt={user.name} />
            <button className="edit-avatar">
              <Edit />
            </button>
          </div>
          <div className="profile-info">
            <h1>{user.name}</h1>
            <p className="user-bio">{user.bio}</p>
            <div className="profile-stats">
              <div className="stat">
                <span className="stat-value">{user.eventsCreated}</span>
                <span className="stat-label">Eventos Creados</span>
              </div>
              <div className="stat">
                <span className="stat-value">{user.eventsAttended}</span>
                <span className="stat-label">Eventos Asistidos</span>
              </div>
              <div className="stat">
                <span className="stat-value">{user.memberSince}</span>
                <span className="stat-label">Miembro desde</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs de navegación */}
        <div className="profile-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon className="tab-icon" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Contenido de las tabs */}
        <div className="tab-content">
          {activeTab === 'profile' && (
            <div className="profile-details">
              <div className="section-header">
                <h2>Información Personal</h2>
                <button 
                  className="edit-button"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Edit />
                  {isEditing ? 'Guardar' : 'Editar'}
                </button>
              </div>

              <div className="details-grid">
                <div className="detail-item">
                  <Mail className="detail-icon" />
                  <div className="detail-content">
                    <label>Email</label>
                    <input
                      type="email"
                      value={user.email}
                      disabled={!isEditing}
                      className={isEditing ? 'editable' : ''}
                    />
                  </div>
                </div>

                <div className="detail-item">
                  <Phone className="detail-icon" />
                  <div className="detail-content">
                    <label>Teléfono</label>
                    <input
                      type="tel"
                      value={user.phone}
                      disabled={!isEditing}
                      className={isEditing ? 'editable' : ''}
                    />
                  </div>
                </div>

                <div className="detail-item">
                  <MapPin className="detail-icon" />
                  <div className="detail-content">
                    <label>Ubicación</label>
                    <input
                      type="text"
                      value={user.location}
                      disabled={!isEditing}
                      className={isEditing ? 'editable' : ''}
                    />
                  </div>
                </div>

                <div className="detail-item full-width">
                  <User className="detail-icon" />
                  <div className="detail-content">
                    <label>Biografía</label>
                    <textarea
                      value={user.bio}
                      disabled={!isEditing}
                      className={isEditing ? 'editable' : ''}
                      rows="3"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'events' && (
            <div className="events-section">
              <div className="section-header">
                <h2>Mis Eventos</h2>
                <button className="btn btn-primary">
                  <Plus />
                  Crear Evento
                </button>
              </div>

              <div className="events-grid">
                {userEvents.map((event) => (
                  <div key={event.id} className="event-card">
                    <div className="event-image">
                      <img src={event.image} alt={event.title} />
                      {getStatusBadge(event.status)}
                    </div>
                    <div className="event-content">
                      <h3>{event.title}</h3>
                      <div className="event-meta">
                        <span>{event.date}</span>
                        <span>{event.attendees} asistentes</span>
                      </div>
                      <div className="event-actions">
                        <button className="btn btn-secondary">Editar</button>
                        <button className="btn btn-secondary">Ver Detalles</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'attended' && (
            <div className="attended-events">
              <div className="section-header">
                <h2>Eventos Asistidos</h2>
              </div>

              <div className="events-grid">
                {attendedEvents.map((event) => (
                  <div key={event.id} className="event-card">
                    <div className="event-image">
                      <img src={event.image} alt={event.title} />
                      {getStatusBadge(event.status)}
                    </div>
                    <div className="event-content">
                      <h3>{event.title}</h3>
                      <div className="event-meta">
                        <span>{event.date}</span>
                        <div className="event-rating">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={`star ${i < event.rating ? 'filled' : ''}`}>
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="event-actions">
                        <button className="btn btn-secondary">Ver Detalles</button>
                        <button className="btn btn-secondary">Dejar Reseña</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="settings-section">
              <div className="section-header">
                <h2>Configuración</h2>
              </div>

              <div className="settings-grid">
                <div className="setting-item">
                  <h3>Notificaciones</h3>
                  <div className="setting-options">
                    <label className="checkbox-container">
                      <input type="checkbox" defaultChecked />
                      <span className="checkmark"></span>
                      Notificaciones por email
                    </label>
                    <label className="checkbox-container">
                      <input type="checkbox" defaultChecked />
                      <span className="checkmark"></span>
                      Notificaciones push
                    </label>
                    <label className="checkbox-container">
                      <input type="checkbox" />
                      <span className="checkmark"></span>
                      Newsletter semanal
                    </label>
                  </div>
                </div>

                <div className="setting-item">
                  <h3>Privacidad</h3>
                  <div className="setting-options">
                    <label className="checkbox-container">
                      <input type="checkbox" defaultChecked />
                      <span className="checkmark"></span>
                      Perfil público
                    </label>
                    <label className="checkbox-container">
                      <input type="checkbox" />
                      <span className="checkmark"></span>
                      Mostrar eventos asistidos
                    </label>
                  </div>
                </div>

                <div className="setting-item">
                  <h3>Cuenta</h3>
                  <div className="account-actions">
                    <button className="btn btn-secondary">
                      Cambiar Contraseña
                    </button>
                    <button className="btn btn-secondary">
                      Exportar Datos
                    </button>
                    <button className="btn btn-error">
                      <LogOut />
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile 