// backend/src/controllers/contactController.js
const nodemailer = require('nodemailer');
// NO ES NECESARIO cargar dotenv aquí si ya lo haces en app.js o api/index.js
// const dotenv = require('dotenv');
// dotenv.config({ path: './.env' }); // REMOVE THIS LINE - se carga globalmente

// Configura el 'transporter' de Nodemailer.
// Esto es tu configuración SMTP (Simple Mail Transfer Protocol).
// Las variables process.env.* deben estar disponibles aquí porque app.js o api/index.js
// ya cargaron dotenv antes de que este archivo sea requerido.
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST, // Ej: 'smtp.gmail.com' para Gmail, o el host de tu proveedor
    port: process.env.EMAIL_PORT, // Ej: 587 (para TLS) o 465 (para SSL)
    secure: process.env.EMAIL_PORT == 465, // true para 465 (SSL), false para otros puertos (como 587 con TLS)
    auth: {
        user: process.env.EMAIL_USER, // Tu dirección de correo electrónico (ej: tu_email@gmail.com)
        pass: process.env.EMAIL_PASS, // La contraseña de tu correo o una "App password" (¡recomendado para Gmail!)
    },
    // Descomenta y ajusta si tienes problemas con certificados SSL en desarrollo
    // tls: {
    //   rejectUnauthorized: false
    // }
});

// Función para enviar el correo de contacto
const sendContactEmail = async (req, res) => {
    const { name, email, subject, message } = req.body;

    // Validación básica
    if (!name || !email || !subject || !message) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
    }

    try {
        // Opciones del correo electrónico
        const mailOptions = {
            // Remitente: usa la dirección de correo del cliente como remitente
            // o usa tu propio EMAIL_USER para asegurar que pase los filtros SPF/DKIM
            // y la dirección del cliente en Reply-To.
            // He corregido la sintaxis de las template literals aquí.
            from: `"${name}" <${process.env.EMAIL_USER}>`, // Esto es más seguro para evitar que el correo sea marcado como spam
            replyTo: email, // El correo del cliente para que puedas responder directamente
            to: process.env.RECIPIENT_EMAIL, // Tu dirección de correo electrónico donde quieres recibir los mensajes
            subject: `Mensaje de Contacto: ${subject}`, // He corregido la sintaxis de las template literals aquí.
            html: `
                <p><strong>Nombre:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Asunto:</strong> ${subject}</p>
                <p><strong>Mensaje:</strong></p>
                <p>${message}</p>
            `,
        };

        // Envía el correo
        await transporter.sendMail(mailOptions);
        console.log('Correo de contacto enviado con éxito');
        res.status(200).json({ message: 'Mensaje enviado exitosamente.' });

    } catch (error) {
        console.error('Error al enviar el correo de contacto:', error);
        res.status(500).json({ error: 'Error al enviar el mensaje. Por favor, inténtalo de nuevo.' });
    }
};

// Exporta la función para que pueda ser importada por las rutas
module.exports = { sendContactEmail };