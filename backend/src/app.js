// backend/src/app.js
// 1. CARGA DE VARIABLES DE ENTORNO: Debe ser lo primero y con la ruta ABSOLUTA
require('dotenv').config({ path: __dirname + '/../.env' }); //
// __dirname es 'backend/src'
// '/../.env' sube un nivel a 'backend/' y busca .env allí

const express = require('express');
const cors = require('cors'); // Para permitir solicitudes desde tu frontend

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const contactRoutes = require('./routes/contactRoutes'); // <--- NUEVA: Importa las rutas de contacto

const app = express();
const PORT = process.env.PORT || 3001; // Puerto del servidor backend para desarrollo local

// Leer los orígenes permitidos desde las variables de entorno
// Separa por comas si hay múltiples orígenes (ej. 'http://localhost:5173,https://tu-frontend.vercel.app')
const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:5173']; // Agrega el valor por defecto si no está en .env para desarrollo

// Middlewares
app.use(cors({
    origin: function (origin, callback) {
        // Permitir solicitudes sin origen (como de herramientas como Postman o curl)
        // O si el origen es la misma aplicación en Vercel, o si está en la lista de permitidos
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        // Para entornos de desarrollo (ej. local)
        if (process.env.NODE_ENV !== 'production') {
            return callback(null, true); // Permite cualquier origen en desarrollo
        }

        const msg = `La política CORS para este sitio no permite el acceso desde el origen especificado ${origin}.`;
        return callback(new Error(msg), false);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Asegúrate de incluir PATCH si lo usas, como en AdminDashboard para actualizar
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json()); // Para parsear JSON en el cuerpo de las solicitudes
app.use(express.urlencoded({ extended: true })); // Para parsear datos de formularios URL-encoded (si los necesitas, aunque para JSON no es estrictamente necesario)

// Rutas
app.use('/api/auth', authRoutes); // Rutas de autenticación
app.use('/api/products', productRoutes); // Rutas de productos
app.use('/api/contact', contactRoutes); // <-- Rutas para el formulario de contacto

// Ruta de prueba (si accedes a la API base)
app.get('/api', (req, res) => {
    res.send('Backend de Yeka Magic Bags funcionando!');
});

// Ruta raíz (para cuando accedes al puerto del backend directamente en desarrollo)
app.get('/', (req, res) => {
    res.send('Backend de Yeka Magic Bags funcionando!');
});


// Manejo de errores global
app.use((err, req, res, next) => {
    console.error(err.stack);
    // Puedes personalizar la respuesta de error según el tipo de error
    res.status(err.status || 500).send({
        error: err.message || 'Algo salió mal en el servidor!',
        details: process.env.NODE_ENV === 'development' ? err.stack : undefined // Muestra el stack solo en desarrollo
    });
});

// Iniciar el servidor (Solo para desarrollo local. Vercel ignora esta parte para funciones serverless)
app.listen(PORT, () => {
    console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
});

// Exportar la instancia de la aplicación Express
// ¡Esto es CRÍTICO para que Vercel pueda usar tu aplicación como una función serverless!
module.exports = app;