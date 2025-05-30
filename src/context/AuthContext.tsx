// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Para manejar la carga inicial

  useEffect(() => {
    // Verificar el token al cargar la aplicación desde sessionStorage
    const token = sessionStorage.getItem('adminToken'); // CAMBIO: de localStorage a sessionStorage
    if (token) {
      // Opcional: Podrías hacer una petición al backend para validar el token si es necesario
      // Por simplicidad, asumimos que si el token existe, estamos autenticados (hasta que falle una petición)
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = (token: string) => {
    sessionStorage.setItem('adminToken', token); // CAMBIO: de localStorage a sessionStorage
    setIsAuthenticated(true);
  };

  const logout = () => {
    sessionStorage.removeItem('adminToken'); // CAMBIO: de localStorage a sessionStorage
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Configurar Axios para incluir el token en cada solicitud
axios.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem('adminToken'); // CAMBIO: de localStorage a sessionStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Manejar errores de token expirado o inválido
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      const originalRequest = error.config;
      // Evitar bucle infinito si la solicitud ya era para /api/auth/login
      if (originalRequest.url && !originalRequest.url.includes('/api/auth/login')) {
        sessionStorage.removeItem('adminToken'); // CAMBIO: de localStorage a sessionStorage
        // Esto puede no funcionar directamente para redirigir fuera de un componente de React.
        // Se puede mejorar con un callback o un manejador de estado global.
        // Por ahora, simplemente limpiamos el token. La redirección la hará ProtectedRoute.
        window.location.href = '/admin-login'; // Redirigir al login
      }
    }
    return Promise.reject(error);
  }
);