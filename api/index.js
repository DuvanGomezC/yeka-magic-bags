// api/index.js
const dotenv = require('dotenv');

// Carga las variables de entorno desde el archivo .env del backend.
// Esto es crucial para que Nodemailer y otras configuraciones de tu backend
// tengan acceso a las variables de entorno cuando Vercel ejecuta esta función.
// La ruta './backend/.env' es para desarrollo local con Vercel CLI (si lo usas).
// En el despliegue real de Vercel, las variables se inyectan directamente desde el dashboard.
dotenv.config({ path: './backend/.env' });

// Importa tu aplicación Express principal desde backend/src/app.js.
// La ruta es relativa desde 'api/index.js' hasta 'backend/src/app.js'.
const app = require('../backend/src/app');

// Exporta la aplicación Express como un handler para Vercel.
// Vercel buscará un 'module.exports' que exporte una instancia de Express o una función.
module.exports = app;