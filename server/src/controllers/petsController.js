const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { sendFoundEmail } = require('../utils/email');

exports.createPet = async (req, res) => {
  try {
    const { name, type, photoUrl } = req.body;

    const pet = await prisma.pet.create({
      data: {
        name,
        type,
        photoUrl: photoUrl || null,
        ownerId: req.user.id
      }
    });

    res.status(201).json(pet);
  } catch (error) {
    res.status(500).json({ error: "Error al crear mascota" });
  }
};

exports.markAsFound = async (req, res) => {
  try {
    const { qrId } = req.params;
    const { location } = req.body;

    const pet = await prisma.pet.findUnique({
      where: { qrId },
      include: { owner: true }
    });

    if (!pet) return res.status(404).json({ error: "Mascota no encontrada" });

    await prisma.alert.create({
      data: {
        petId: pet.id,
        location,
        status: "found"
      }
    });

    await sendFoundEmail(pet.owner.email, location);
    
    res.status(200).json({ message: "Dueño notificado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al procesar el hallazgo" });
  }
};