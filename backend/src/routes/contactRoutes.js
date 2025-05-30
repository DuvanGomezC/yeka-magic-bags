const express = require('express');
const { sendContactEmail } = require('../controllers/contactController');

const router = express.Router();

router.post('/', sendContactEmail); // Ruta POST para enviar el mensaje de contacto

module.exports = router;