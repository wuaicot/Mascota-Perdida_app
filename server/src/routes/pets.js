const express = require('express');
const router = express.Router();
const { 
  createPet, 
  markAsFound,
  getPetsByOwner // ← Agregar esta importación
} = require('../controllers/petsController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, createPet);
router.get('/', authMiddleware, getPetsByOwner); // ← Nueva ruta GET
router.post('/:qrId/found', markAsFound);

module.exports = router;