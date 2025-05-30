// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
// Ya no necesitamos importar axios aquí directamente para los interceptores globales
// import axios from 'axios'; 

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
    // Verificar el token al cargar la aplicación desde localStorage con la clave 'token'
    const token = localStorage.getItem('token'); // <- CAMBIO: Usa localStorage y clave 'token'
    if (token) {
      // Opcional: Podrías hacer una petición al backend para validar el token si es necesario
      // Por simplicidad, asumimos que si el token existe, estamos autenticados (hasta que falle una petición)
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = (token: string) => {
    localStorage.setItem('token', token); // <- CAMBIO: Usa localStorage y clave 'token'
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem('token'); // <- CAMBIO: Usa localStorage y clave 'token'
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