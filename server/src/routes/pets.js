// server/src/routes/pets.js
const express = require('express');
const router = express.Router();
const { createPet, markAsFound } = require('../controllers/petsController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, createPet);
router.post('/:qrId/found', markAsFound);

module.exports = router;