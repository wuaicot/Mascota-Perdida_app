//server/src/index.js
require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const cookieParser = require('cookie-parser'); // Añadir
const authRoutes = require('./routes/auth');
const petRoutes = require('./routes/pets');
const alertRoutes = require('./routes/alerts');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares actualizados
app.use(cors({
  origin: process.env.CLIENT_URL,
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
  limits: { fileSize: 5 * 1024 * 1024 },
  abortOnLimit: true,
  safeFileNames: true,
  preserveExtension: true
}));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/alerts', alertRoutes);

// Manejador de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(PORT, () => {
  console.log(`✅ Servidor activo en http://localhost:${PORT}`);
  console.log(`📁 Temporary files dir: ${path.resolve('./tmp')}`);
});