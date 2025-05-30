// backend/src/config/multerConfig.js
const multer = require('multer');

// Configuración de Multer para almacenar archivos en memoria
// Esto es útil porque luego Supabase SDK puede tomar el buffer directamente
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Limite de 5MB por archivo
  },
  fileFilter: (req, file, cb) => {
    // Aceptar solo tipos de imagen
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos de imagen.'), false);
    }
  },
});

module.exports = upload;