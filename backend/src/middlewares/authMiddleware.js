// backend/src/middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Acceso denegado. No se proporcionó token.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Adjuntar la información del usuario al objeto de solicitud
    next(); // Continuar con la siguiente función de middleware o ruta
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado. Por favor, inicia sesión de nuevo.' });
    }
    return res.status(403).json({ error: 'Token inválido. Acceso denegado.' });
  }
};

module.exports = { authenticateAdmin };