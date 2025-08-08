// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react'
import { authApi } from '../services/api'

const AuthContext = createContext()
export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Restaurar sesión desde token guardado
    const storedToken = localStorage.getItem('token')
    if (storedToken) {
      try {
        const payload = JSON.parse(atob(storedToken.split('.')[1]))
        setUser(payload)
        setToken(storedToken)
      } catch {
        localStorage.removeItem('token')
        setUser(null)
        setToken(null)
      }
    }
    setLoading(false)
  }, [])

  const login = async (username, password) => {
    try {
      const data = await authApi.login({ username, password }) // { success, token }
      if (data?.success && data?.token) {
        localStorage.setItem('token', data.token)
        setToken(data.token)
        try {
          const payload = JSON.parse(atob(data.token.split('.')[1]))
          setUser(payload)
        } catch {
          // si falla el decode, igual deja logueado por token
          setUser(null)
        }
        return { success: true }
      }
      return { success: false, message: data?.message || 'Login inválido' }
    } catch (err) {
      return { success: false, message: err.message || 'Error de conexión' }
    }
  }

  const register = async (userData) => {
    try {
      const data = await authApi.register(userData)
      // acá tu backend devuelve { success, message, user? }
      return { success: data?.success, message: data?.message }
    } catch (err) {
      return { success: false, message: err.message || 'Error de conexión' }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
