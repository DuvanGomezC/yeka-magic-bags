// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
    // Verificar el token al cargar la aplicación desde sessionStorage con la clave 'token'
    const token = sessionStorage.getItem('token'); // <- CAMBIO: Usa sessionStorage y clave 'token'
    if (token) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = (token: string) => {
    sessionStorage.setItem('token', token); // <- CAMBIO: Usa sessionStorage y clave 'token'
    setIsAuthenticated(true);
  };

  const logout = () => {
    sessionStorage.removeItem('token'); // <- CAMBIO: Usa sessionStorage y clave 'token'
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