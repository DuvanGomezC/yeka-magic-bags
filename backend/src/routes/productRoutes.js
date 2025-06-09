const express = require('express');
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
} = require('../controllers/productController');
const { authenticateAdmin } = require('../middlewares/authMiddleware');
const upload = require('../config/multerConfig'); // Importa la configuración de multer


const router = express.Router();

// --- RUTAS PÚBLICAS: NO requieren autenticación ---
// Los clientes pueden ver todos los productos
router.get('/', getProducts);
// Los clientes pueden ver un producto por ID
router.get('/:id', getProductById);

// --- RUTAS PROTEGIDAS por el middleware de autenticación (solo para administradores) ---
// Para la creación y actualización, usa upload.array('images', 5) para manejar múltiples imágenes
router.post('/', authenticateAdmin, upload.array('images', 5), createProduct); // 'images' es el nombre del campo en el formulario
router.put('/:id', authenticateAdmin, upload.array('images', 5), updateProduct); // 'images' es el nombre del campo en el formulario
router.delete('/:id', authenticateAdmin, deleteProduct);
router.get('/categories', productController.getCategories);

module.exports = router;