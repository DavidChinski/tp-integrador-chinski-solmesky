import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, MapPin, Users, DollarSign, Image, Plus, X } from 'lucide-react'
import './CreateEvent.css'

const CreateEvent = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    date: '',
    time: '',
    location: '',
    maxAttendees: '',
    price: '',
    image: null,
    imagePreview: null
  })
  const [errors, setErrors] = useState({})

  const categories = [
    'Tecnología',
    'Marketing',
    'Networking',
    'Entretenimiento',
    'Educación',
    'Empleo',
    'Deportes',
    'Arte y Cultura',
    'Otros'
  ]

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData(prev => ({
        ...prev,
        image: file,
        imagePreview: URL.createObjectURL(file)
      }))
    }
  }

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      image: null,
      imagePreview: null
    }))
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = 'El título es requerido'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida'
    }

    if (!formData.category) {
      newErrors.category = 'La categoría es requerida'
    }

    if (!formData.date) {
      newErrors.date = 'La fecha es requerida'
    }

    if (!formData.time) {
      newErrors.time = 'La hora es requerida'
    }

    if (!formData.location.trim()) {
      newErrors.location = 'La ubicación es requerida'
    }

    if (!formData.maxAttendees) {
      newErrors.maxAttendees = 'El número máximo de asistentes es requerido'
    } else if (parseInt(formData.maxAttendees) < 1) {
      newErrors.maxAttendees = 'Debe ser al menos 1'
    }

    if (formData.price && parseFloat(formData.price) < 0) {
      newErrors.price = 'El precio no puede ser negativo'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    
    // Simular creación de evento
    setTimeout(() => {
      setIsLoading(false)
      console.log('Event created:', formData)
      // Aquí iría la lógica real de creación
      navigate('/events')
    }, 2000)
  }

  return (
    <div className="create-event-page">
      <div className="page-header">
        <h1 className="page-title">Crear Nuevo Evento</h1>
        <p className="page-subtitle">Comparte tu evento con la comunidad</p>
      </div>

      <div className="create-event-container">
        <form onSubmit={handleSubmit} className="create-event-form">
          <div className="form-section">
            <h2>Información Básica</h2>
            
            <div className="form-group">
              <label htmlFor="title">Título del Evento *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Ej: Conferencia de Tecnología 2024"
                className={`form-input ${errors.title ? 'error' : ''}`}
              />
              {errors.title && <span className="error-message">{errors.title}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="description">Descripción *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe tu evento, qué aprenderán los asistentes, quiénes son los speakers..."
                className={`form-textarea ${errors.description ? 'error' : ''}`}
                rows="4"
              />
              {errors.description && <span className="error-message">{errors.description}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category">Categoría *</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`form-select ${errors.category ? 'error' : ''}`}
                >
                  <option value="">Selecciona una categoría</option>
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                {errors.category && <span className="error-message">{errors.category}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="price">Precio (USD)</label>
                <div className="input-with-icon">
                  <DollarSign className="input-icon" />
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className={`form-input ${errors.price ? 'error' : ''}`}
                  />
                </div>
                {errors.price && <span className="error-message">{errors.price}</span>}
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Fecha y Ubicación</h2>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="date">Fecha *</label>
                <div className="input-with-icon">
                  <Calendar className="input-icon" />
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    className={`form-input ${errors.date ? 'error' : ''}`}
                  />
                </div>
                {errors.date && <span className="error-message">{errors.date}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="time">Hora *</label>
                <div className="input-with-icon">
                  <Calendar className="input-icon" />
                  <input
                    type="time"
                    id="time"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className={`form-input ${errors.time ? 'error' : ''}`}
                  />
                </div>
                {errors.time && <span className="error-message">{errors.time}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="location">Ubicación *</label>
              <div className="input-with-icon">
                <MapPin className="input-icon" />
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Ej: Centro de Convenciones, Calle Principal 123"
                  className={`form-input ${errors.location ? 'error' : ''}`}
                />
              </div>
              {errors.location && <span className="error-message">{errors.location}</span>}
            </div>
          </div>

          <div className="form-section">
            <h2>Capacidad</h2>
            
            <div className="form-group">
              <label htmlFor="maxAttendees">Número máximo de asistentes *</label>
              <div className="input-with-icon">
                <Users className="input-icon" />
                <input
                  type="number"
                  id="maxAttendees"
                  name="maxAttendees"
                  value={formData.maxAttendees}
                  onChange={handleChange}
                  placeholder="100"
                  min="1"
                  className={`form-input ${errors.maxAttendees ? 'error' : ''}`}
                />
              </div>
              {errors.maxAttendees && <span className="error-message">{errors.maxAttendees}</span>}
            </div>
          </div>

          <div className="form-section">
            <h2>Imagen del Evento</h2>
            
            <div className="image-upload">
              {formData.imagePreview ? (
                <div className="image-preview">
                  <img src={formData.imagePreview} alt="Preview" />
                  <button
                    type="button"
                    className="remove-image"
                    onClick={removeImage}
                  >
                    <X />
                  </button>
                </div>
              ) : (
                <div className="image-upload-area">
                  <input
                    type="file"
                    id="image"
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="image-input"
                  />
                  <label htmlFor="image" className="image-upload-label">
                    <Image className="upload-icon" />
                    <span>Haz clic para subir una imagen</span>
                    <span className="upload-hint">PNG, JPG hasta 5MB</span>
                  </label>
                </div>
              )}
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/events')}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`btn btn-primary ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Creando evento...' : 'Crear Evento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateEvent 