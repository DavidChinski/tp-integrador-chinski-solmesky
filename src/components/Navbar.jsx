import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Calendar, Plus, User, Menu, X, LogOut } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import './Navbar.css'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const location = useLocation()
  const { isAuthenticated, user, logout } = useAuth()

  const navItems = [
    { path: '/', label: 'Inicio', icon: Calendar },
    { path: '/events', label: 'Eventos', icon: Calendar },
    { path: '/create-event', label: 'Crear Evento', icon: Plus },
  ]

  const isActive = (path) => location.pathname === path

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <Calendar className="navbar-logo" />
          <span>EventManager</span>
        </Link>

        {/* Desktop Menu */}
        <div className="navbar-menu desktop">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`navbar-link ${isActive(item.path) ? 'active' : ''}`}
            >
              <item.icon className="navbar-icon" />
              {item.label}
            </Link>
          ))}
        </div>

        {/* User Menu */}
        <div className="navbar-user">
          {isAuthenticated ? (
            <div className="user-menu">
              <Link to="/profile" className="btn btn-secondary">
                <User className="navbar-icon" />
                {user?.first_name || 'Mi Perfil'}
              </Link>
              <button className="btn btn-secondary" onClick={logout}>
                <LogOut className="navbar-icon" />
                Salir
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="btn btn-secondary">
                Iniciar Sesión
              </Link>
              <Link to="/register" className="btn btn-primary">
                Registrarse
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            className="mobile-menu-btn"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="mobile-menu">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`mobile-menu-link ${isActive(item.path) ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <item.icon className="navbar-icon" />
              {item.label}
            </Link>
          ))}
          
          {!isAuthenticated && (
            <div className="mobile-auth">
              <Link to="/login" className="btn btn-secondary">
                Iniciar Sesión
              </Link>
              <Link to="/register" className="btn btn-primary">
                Registrarse
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}

export default Navbar 