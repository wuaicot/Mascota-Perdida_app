// server/src/routes/auth.js
const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

// Registro de dueños
router.post('/register', register);

// Login de dueños
router.post('/login', login);

module.exports = router;