// backend/src/controllers/authController.js
const supabase = require('../config/supabase');
const { comparePassword } = require('../utils/hashUtils');
const jwt = require('jsonwebtoken');

const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña son requeridos.' });
  }

  try {
    const { data: adminUser, error } = await supabase
      .from('admin_users')
      .select('id, email, password_hash')
      .eq('email', email)
      .single();

    if (error && error.code === 'PGRST116') { // No rows found
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }
    if (error) {
      console.error('Error al buscar usuario administrador:', error);
      return res.status(500).json({ error: 'Error del servidor al intentar iniciar sesión.' });
    }

    // Comparar la contraseña proporcionada con el hash almacenado
    const isPasswordValid = await comparePassword(password, adminUser.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    // Generar un token JWT
    const token = jwt.sign(
      { id: adminUser.id, email: adminUser.email, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' } // El token expira en 1 hora
    );

    res.json({ message: 'Login exitoso', token });

  } catch (err) {
    console.error('Error en loginAdmin:', err);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

module.exports = { loginAdmin };