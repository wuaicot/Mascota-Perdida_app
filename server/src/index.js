require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/auth');
const petRoutes = require('./routes/pets');
const alertRoutes = require('./routes/alerts');

const app = express();
const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Forzar HTTPS en producción
if (NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect(301, `https://${req.headers.host}${req.url}`);
    }
    next();
  });
}

// CORS Configuración dinámica según entorno
const allowedOrigin = NODE_ENV === 'development'
  ? 'http://localhost:3000'
  : process.env.CLIENT_URL;

console.log(`✅ Entorno: ${NODE_ENV}`);
console.log(`🌍 Origen permitido: ${allowedOrigin}`);

app.use(cors({
  origin: allowedOrigin,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
}));

// Middlewares esenciales
app.use(express.json({ limit: '5mb' }));
app.use(cookieParser());

// Subida de archivos
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: path.join(__dirname, '../tmp'),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  abortOnLimit: true,
  safeFileNames: true,
  preserveExtension: true
}));

// Ruta de verificación de salud (útil para Elastic Beanstalk y otras plataformas cloud)
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/alerts', alertRoutes);

// Middleware global de manejo de errores
app.use((err, req, res, next) => {
  console.error('❌ Error interno del servidor:', err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Inicialización del servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
  if (NODE_ENV === 'development') {
    console.log(`🌐 Accede en: http://localhost:${PORT}`);
  }
  console.log(`📁 Carpeta de archivos temporales: ${path.resolve('./tmp')}`);
});
