// server/src/controllers/petsController.js
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
            email: true,
            id: true
          }
        }
      }
    });

    res.status(201).json({
      id: pet.id,
      name: pet.name,
      qrId: pet.qrId,
      photoUrl: pet.photoUrl,
      ownerEmail: pet.owner.email
    });

  } catch (error) {
    console.error('Error creating pet:', error);
    
    // Manejo de errores de Prisma
    if (error.code === 'P2002') {
      return res.status(400).json({ error: "Error de duplicación en la base de datos" });
    }
    
    res.status(500).json({ error: "Error al crear la mascota" });
  }
};

exports.getPetsByOwner = async (req, res) => {
  try {
    const pets = await prisma.pet.findMany({
      where: { ownerId: req.user.id },
      include: {
        alerts: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 5
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    res.json(pets.map(pet => ({
      ...pet,
      alerts: pet.alerts.map(alert => ({
        ...alert,
        location: alert.location ? alert.location.split(',').map(Number) : null
      }))
    })));
    
  } catch (error) {
    console.error('Error fetching pets:', error);
    res.status(500).json({ 
      error: "Error obteniendo mascotas",
      details: error.message
    });
  }
};

exports.markAsFound = async (req, res) => {
  try {
    const { qrId } = req.params;
    const { location } = req.body;

    // Validar formato de ubicación
    if (!location || !location.match(/^-?\d+\.?\d*,-?\d+\.?\d*$/)) {
      return res.status(400).json({ error: "Formato de ubicación inválido" });
    }

    const pet = await prisma.pet.findUnique({
      where: { qrId },
      include: { 
        owner: {
          select: {
            email: true,
            id: true
          }
        },
        alerts: true
      }
    });

    if (!pet) {
      return res.status(404).json({ error: "Mascota no encontrada" });
    }

    // Crear alerta de encontrado
    const newAlert = await prisma.alert.create({
      data: {
        petId: pet.id,
        location,
        status: "found"
      }
    });

    // Enviar notificación
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
    console.error('Error marking as found:', error);
    res.status(500).json({
      error: "Error al procesar el hallazgo",
      details: error.message
    });
  }
};

// Función auxiliar para validar tipos de mascota
const validatePetType = (type) => {
  const allowedTypes = ['perro', 'gato', 'otro'];
  return allowedTypes.includes(type.toLowerCase());
};