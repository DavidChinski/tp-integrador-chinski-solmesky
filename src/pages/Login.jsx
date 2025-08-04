import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, Calendar } from 'lucide-react'
import './Auth.css'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Simular llamada a API
    setTimeout(() => {
      setIsLoading(false)
      // Aquí iría la lógica de autenticación real
      console.log('Login attempt:', formData)
    }, 1000)
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo">
              <Calendar className="auth-logo-icon" />
              <span>EventManager</span>
            </div>
            <h1>Bienvenido de vuelta</h1>
            <p>Inicia sesión en tu cuenta para continuar</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">Correo electrónico</label>
              <div className="input-container">
                <Mail className="input-icon" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="tu@email.com"
                  className="auth-input"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">Contraseña</label>
              <div className="input-container">
                <Lock className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Tu contraseña"
                  className="auth-input"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            <div className="form-options">
              <label className="checkbox-container">
                <input type="checkbox" />
                <span className="checkmark"></span>
                Recordarme
              </label>
              <Link to="/forgot-password" className="forgot-password">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>

            <button
              type="submit"
              className={`btn btn-primary auth-submit ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>

          <div className="auth-divider">
            <span>o</span>
          </div>

          <div className="social-auth">
            <button className="btn btn-secondary social-btn">
              <svg className="google-icon" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continuar con Google
            </button>
          </div>

          <div className="auth-footer">
            <p>
              ¿No tienes una cuenta?{' '}
              <Link to="/register" className="auth-link">
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login 