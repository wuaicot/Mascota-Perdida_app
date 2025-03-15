// server/src/routes/pets.js
const express = require('express');
const router = express.Router();
const { createPet } = require('../controllers/petsController'); // <- Corrige la ruta
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, createPet);

module.exports = router;