// src/utils/axiosInstance.ts - VERSIÓN OPTIMIZADA
import axios from 'axios';

// La URL real de tu backend en Render
const BACKEND_RENDER_URL = 'https://yeka-magic-bags-backend.onrender.com';

// Crea una instancia de Axios con una configuración base
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_API_URL || BACKEND_RENDER_URL,
    timeout: 15000, // 🚀 Aumentado a 15 segundos para consultas lentas
    headers: {
        'Content-Type': 'application/json',
        // 🚀 Headers de cache para mejorar rendimiento
        'Cache-Control': 'public, max-age=300', // Cache por 5 minutos
    },
});

// Interceptor de solicitud para añadir el token de autorización automáticamente
axiosInstance.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem('token');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // 🚀 Cache específico para categorías (más tiempo)
        if (config.url?.includes('/categories')) {
            config.headers['Cache-Control'] = 'public, max-age=600'; // 10 minutos
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor de respuesta para manejar errores globales
axiosInstance.interceptors.response.use(
    (response) => {
        // 🚀 Log para debugging en desarrollo
        if (import.meta.env.DEV) {
            console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`);
        }
        return response;
    },
    (error) => {
        // 🚀 Log para debugging errores
        if (import.meta.env.DEV) {
            console.error(`❌ ${error.config?.method?.toUpperCase()} ${error.config?.url} - ${error.response?.status || 'Network Error'}`);
        }

        // Si el token expira o no está autorizado y no es una solicitud de login
        if (error.response && error.response.status === 401 && !error.config.url.includes('/api/auth/login')) {
            console.log('Token expirado o no autorizado. Redirigiendo al login...');
            sessionStorage.removeItem('token'); 
            window.location.href = '/admin-login'; 
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;