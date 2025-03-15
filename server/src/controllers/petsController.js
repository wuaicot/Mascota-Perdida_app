// server/src/controllers/petsController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createPet = async (req, res) => {
  try {
    const { name, type, photoUrl } = req.body;
    const qrId = Math.random().toString(36).substr(2, 9); // Genera ID único para QR

    const pet = await prisma.pet.create({
      data: {
        name,
        type,
        qrId,
        photoUrl: photoUrl || null,
        ownerId: req.user.id // Requiere autenticación previa
      }
    });

    res.status(201).json(pet);
  } catch (error) {
    res.status(500).json({ error: "Error al crear mascota" });
  }
};

// Añade otros métodos (getPets, updatePet, deletePet) según necesites