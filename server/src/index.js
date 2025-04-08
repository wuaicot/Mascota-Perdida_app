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

// Forzar HTTPS si estamos en producción
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect(301, 'https://' + req.headers.host + req.url);
    }
    next();
  });
}

// Determinar el origen permitido
const allowedOrigin = process.env.NODE_ENV === 'development'
  ? 'http://localhost:3000'
  : process.env.CLIENT_URL;

console.log("✅ Allowed origin:", allowedOrigin); // <-- Aquí se imprime el origen permitido

// Middlewares
app.use(cors({
  origin: allowedOrigin,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true 
}));

app.use(express.json({ limit: '5mb' }));
app.use(cookieParser());

// Configuración de subida de archivos
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: path.join(__dirname, '../tmp'),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  abortOnLimit: true,
  safeFileNames: true,
  preserveExtension: true
}));

// ✅ Ruta de verificación de salud para Elastic Beanstalk
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Rutas principales de la API
app.use('/api/auth', authRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/alerts', alertRoutes);

// Manejador de errores
app.use((err, req, res, next) => {
  console.error('❌ Error interno del servidor:', err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor activo en https://localhost:${PORT}`);
  console.log(`📁 Temporary files dir: ${path.resolve('./tmp')}`);
});
