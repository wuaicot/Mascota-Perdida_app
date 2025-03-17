const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { sendFoundEmail } = require('../utils/email');
const { uploadToS3 } = require('../utils/storage'); // Función personalizada para AWS S3
const { v4: uuidv4 } = require('uuid');

exports.createPet = async (req, res) => {
  try {
    const { name, type, description } = req.body;

    // Validación de campos requeridos
    if (!name || !type) {
      return res.status(400).json({ error: "Nombre y tipo son campos requeridos" });
    }

    // Validar tipo de mascota
    if (!validatePetType(type)) {
      return res.status(400).json({ error: "Tipo de mascota no válido. Use 'perro', 'gato' o 'otro'" });
    }

    // Manejo de la imagen
    let photoUrl = '';
    if (req.files?.photo) {
      const file = req.files.photo;
      const fileName = `pets/${uuidv4()}-${file.name}`;
      photoUrl = await uploadToS3(file.tempFilePath, fileName);
    }

    // Creación de la mascota
    const pet = await prisma.pet.create({
      data: {
        name,
        type,
        description: description || null,
        photoUrl: photoUrl || null,
        ownerId: req.user.id
      },
      include: {
        owner: {
          select: {
            email: true
          }
        }
      }
    });

    res.status(201).json({
      message: "Mascota registrada exitosamente",
      pet: {
        id: pet.id,
        name: pet.name,
        type: pet.type,
        description: pet.description,
        qrId: pet.qrId,
        photoUrl: pet.photoUrl,
        ownerEmail: pet.owner.email
      }
    });

  } catch (error) {
    console.error('Error al crear la mascota:', error);

    if (error.code === 'P2002') {
      return res.status(400).json({ error: "Mascota duplicada en la base de datos" });
    }

    res.status(500).json({ error: "Error interno al registrar la mascota" });
  }
};

exports.getPetsByOwner = async (req, res) => {
  try {
    const pets = await prisma.pet.findMany({
      where: { ownerId: req.user.id },
      include: {
        alerts: {
          orderBy: { createdAt: 'desc' },
          take: 5
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(pets.map(pet => ({
      ...pet,
      alerts: pet.alerts.map(alert => ({
        ...alert,
        location: alert.location ? alert.location.split(',').map(Number) : null
      }))
    })));

  } catch (error) {
    console.error('Error al obtener mascotas:', error);
    res.status(500).json({ error: "Error al obtener mascotas" });
  }
};

exports.markAsFound = async (req, res) => {
  try {
    const { qrId } = req.params;
    const { location } = req.body;

    if (!location || !location.match(/^-?\d+\.?\d*,-?\d+\.?\d*$/)) {
      return res.status(400).json({ error: "Formato de ubicación inválido" });
    }

    const pet = await prisma.pet.findUnique({
      where: { qrId },
      include: { owner: { select: { email: true } }, alerts: true }
    });

    if (!pet) {
      return res.status(404).json({ error: "Mascota no encontrada" });
    }

    const newAlert = await prisma.alert.create({
      data: {
        petId: pet.id,
        location,
        status: "found"
      }
    });

    await sendFoundEmail(pet.owner.email, {
      petName: pet.name,
      location,
      date: new Date().toLocaleString(),
      mapUrl: `https://maps.google.com/?q=${location}`
    });

    res.status(200).json({
      message: "Dueño notificado exitosamente",
      alertId: newAlert.id,
      petName: pet.name
    });

  } catch (error) {
    console.error('Error al marcar como encontrada:', error);
    res.status(500).json({ error: "Error interno al procesar el hallazgo" });
  }
};

// Función auxiliar para validar tipos de mascota
const validatePetType = (type) => {
  const allowedTypes = ['perro', 'gato', 'otro'];
  return allowedTypes.includes(type.toLowerCase());
};
