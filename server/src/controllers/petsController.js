//server/src/controllers/petsController.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { uploadToS3 } = require("../utils/storage");
const { v4: uuidv4 } = require("uuid");

// Función para crear mascotas
exports.createPet = async (req, res) => {
  try {
    const { name, type, description } = req.body;
    let photoUrl = "";

    if (req.files?.photo) {
      const file = req.files.photo;
      const fileName = `pets/${uuidv4()}-${file.name}`;
      photoUrl = await uploadToS3(file.tempFilePath, fileName);
    }

    const newPet = await prisma.pet.create({
      data: {
        name,
        type,
        description: description || null,
        photoUrl: photoUrl || null,
        ownerId: req.user.id,
      },
    });

    res.status(201).json(newPet);
  } catch (error) {
    console.error("Error al crear mascota:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Función para obtener mascotas del dueño
exports.getPetsByOwner = async (req, res) => { 
  try {
    console.log("Usuario autenticado:", req.user); // 👀 Verificar en logs del servidor
    if (!req.user) {
      return res.status(401).json({ error: "No autorizado" });
    }
    
    const pets = await prisma.pet.findMany({
      where: { ownerId: req.user.id },
      include: { alerts: true }
    });
    res.json(pets);
  } catch (error) {
    console.error('Error al obtener mascotas:', error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};


// Función para eliminar mascotas (¡Verifica que exista!)
exports.deletePet = async (req, res) => {
  try {
    await prisma.pet.delete({ where: { id: parseInt(req.params.id) } });
    res.status(204).end();
  } catch (error) {
    console.error("Error al eliminar mascota:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Función para marcar como encontrada (¡Verifica que exista!)
exports.markAsFound = async (req, res) => {
  // ... lógica de la función ...
};
