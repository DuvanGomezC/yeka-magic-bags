// src/utils/axiosInstance.ts
import axios from 'axios';

// La URL real de tu backend en Render
const BACKEND_RENDER_URL = 'https://yeka-magic-bags-backend.onrender.com';

// Crea una instancia de Axios con una configuración base
const axiosInstance = axios.create({
    // Usa la variable de entorno para la URL base del backend si está disponible,
    // de lo contrario, usa la URL de Render directamente como fallback.
    baseURL: import.meta.env.VITE_BACKEND_API_URL || BACKEND_RENDER_URL,
    timeout: 10000, // Opcional: Define un tiempo de espera para las solicitudes (en milisegundos)
    headers: {
        'Content-Type': 'application/json',
        // Puedes añadir otros headers comunes aquí, como un token de autorización si lo tienes
        // 'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
});

// Opcional: Interceptores de solicitud para añadir un token de autorización automáticamente
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); // Asume que guardas el token en localStorage
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Opcional: Interceptores de respuesta para manejar errores globales o refrescar tokens
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Ejemplo: Si el token expira y recibes un 401
        if (error.response && error.response.status === 401) {
            console.log('Token expirado o no autorizado. Redirigiendo al login...');
            // Aquí podrías redirigir al usuario a la página de login
            // window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;