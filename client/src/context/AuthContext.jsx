import { createContext, useContext, useState } from 'react';

// Contexto de autenticación para almacenar y compartir el token JWT
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Intenta recuperar el token almacenado en localStorage para mantener la sesión
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Guarda el token y persiste en localStorage
  const login = (newToken) => {
    setToken(newToken);
    localStorage.setItem('token', newToken);
  };

  // Limpia el token tanto del estado como del almacenamiento
  const logout = () => {
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para acceder fácilmente al contexto
export const useAuth = () => useContext(AuthContext);

export default AuthContext;
