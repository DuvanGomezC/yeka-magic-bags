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
    },
});

// Interceptor de solicitud para añadir el token de autorización automáticamente
axiosInstance.interceptors.request.use(
    (config) => {
        // *** CAMBIO CLAVE AQUÍ: Buscar el token en sessionStorage ***
        const token = sessionStorage.getItem('token'); // <- CAMBIO: Busca en sessionStorage

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor de respuesta para manejar errores globales o refrescar tokens
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Si el token expira o no está autorizado y no es una solicitud de login
        if (error.response && error.response.status === 401 && !error.config.url.includes('/api/auth/login')) {
            console.log('Token expirado o no autorizado. Redirigiendo al login...');
            // Limpia el token de sessionStorage (aunque se borraría al cerrar la ventana)
            sessionStorage.removeItem('token'); 
            // Esto redirigirá al usuario a la página de login
            window.location.href = '/admin-login'; 
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;