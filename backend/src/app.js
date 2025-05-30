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

// CONFIGURACIÓN CORS MEJORADA PARA RENDER
const corsOptions = {
    origin: function (origin, callback) {
        // Lista de orígenes permitidos (actualizada para Render)
        const allowedOrigins = [
            'https://yeka-magic-bags-frontend.onrender.com',
            'https://yeka-magic-bags.netlify.app',
            'http://localhost:5173',
            'http://localhost:3000',
            'http://localhost:4173'
        ];

        // Agregar orígenes desde variables de entorno si existen
        if (process.env.ALLOWED_ORIGINS) {
            const envOrigins = process.env.ALLOWED_ORIGINS.split(',');
            allowedOrigins.push(...envOrigins);
        }

        // Permitir solicitudes sin origen (Postman, curl, etc.)
        if (!origin) {
            return callback(null, true);
        }

        // Verificar si el origen está en la lista permitida
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        // Para entornos de desarrollo, ser más permisivo
        if (process.env.NODE_ENV !== 'production') {
            return callback(null, true);
        }

        // En producción, rechazar orígenes no permitidos
        const msg = `La política CORS para este sitio no permite el acceso desde el origen especificado ${origin}.`;
        return callback(new Error(msg), false);
    },
    credentials: true, // Permitir cookies y credenciales
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // Incluir OPTIONS para preflight
    allowedHeaders: [
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Accept',
        'Authorization',
        'Cache-Control'
    ],
    optionsSuccessStatus: 200 // Para compatibilidad con navegadores legacy
};

// Aplicar CORS
app.use(cors(corsOptions));

// Middleware adicional para headers CORS (por si acaso)
app.use((req, res, next) => {
    // Obtener el origen de la solicitud
    const origin = req.headers.origin;
    
    // Si el origen está permitido, agregarlo al header
    const allowedOrigins = [
        'https://yeka-magic-bags-frontend.onrender.com',
        'http://localhost:5173',
        'http://localhost:3000',
        'http://localhost:4173'
    ];
    
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS,PATCH');
    res.setHeader('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Accept,Authorization,Cache-Control');
    
    // Responder a solicitudes preflight OPTIONS
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

// Middlewares para parsing
app.use(express.json({ limit: '10mb' })); // Para parsear JSON en el cuerpo de las solicitudes
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Para parsear datos de formularios URL-encoded

// RUTAS
app.use('/api/auth', authRoutes); // Rutas de autenticación
app.use('/api/products', productRoutes); // Rutas de productos
app.use('/api/contact', contactRoutes); // Rutas para el formulario de contacto

// Ruta de prueba para verificar conectividad
app.get('/api/test', (req, res) => {
    res.json({
        message: 'Backend de Yeka Magic Bags funcionando correctamente!',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development',
        port: PORT
    });
});

// Ruta de prueba (si accedes a la API base)
app.get('/api', (req, res) => {
    res.json({
        message: 'Backend de Yeka Magic Bags funcionando!',
        availableEndpoints: [
            '/api/auth',
            '/api/products', 
            '/api/contact',
            '/api/test'
        ]
    });
});

// Ruta raíz (para cuando accedes al puerto del backend directamente)
app.get('/', (req, res) => {
    res.json({
        message: 'Yeka Magic Bags API',
        status: 'Online',
        version: '1.0.0'
    });
});

// Manejo de errores CORS específico
app.use((err, req, res, next) => {
    if (err.message && err.message.includes('CORS')) {
        return res.status(403).json({
            error: 'CORS Error',
            message: 'No tienes permisos para acceder desde este origen',
            origin: req.headers.origin
        });
    }
    next(err);
});

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    console.error('Stack:', err.stack);
    
    res.status(err.status || 500).json({
        error: err.message || 'Algo salió mal en el servidor!',
        details: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Ruta no encontrada',
        path: req.originalUrl,
        method: req.method
    });
});

// Iniciar el servidor (Solo para desarrollo local. Render/Vercel manejan esto automáticamente)
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Servidor backend corriendo en puerto ${PORT}`);
        console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}`);
    });
}

// Exportar la instancia de la aplicación Express
// ¡Esto es CRÍTICO para que Render/Vercel puedan usar tu aplicación!
module.exports = app;