//client/src/components/PetCard.js

import Image from "next/image";
import { useState } from "react";
import { FaDog, FaCat, FaTrash, FaInfoCircle, FaRegSadTear } from "react-icons/fa";
import axios from "axios";
import { useRouter } from "next/router";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import HeroContactModal from "./HeroContactModal"; // Modal para mostrar la info del Héroe

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const PetCard = ({ pet, onDelete }) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showHeroModal, setShowHeroModal] = useState(false);
  const [heroContact, setHeroContact] = useState(null);

  console.log("Imagen de la mascota:", pet.photoUrl); // Para depuración

  const handleDelete = async () => {
    if (!confirm(`¿Seguro que quieres eliminar a ${pet.name} permanentemente?`)) return;

    try {
      setIsDeleting(true);

      await axios.delete(`${API_BASE_URL}/api/pets/${pet.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      });

      toast.success("Mascota eliminada con éxito");

      // Reproducir sonido de eliminación
      const deleteSound = new Audio("/sdeleted.mp3");
      deleteSound.play().catch((err) =>
        console.error("Error al reproducir sonido:", err)
      );

      setTimeout(() => {
        onDelete(pet.id);
      }, 500);
    } catch (error) {
      console.error("Error eliminando mascota:", error);
      toast.error(error.response?.data?.error || "Error al eliminar la mascota");
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  const handleImageError = () => {
    console.error("Error cargando imagen:", pet.photoUrl);
    setImageError(true);
  };

  // Función para mostrar el modal con la info del Héroe
  const handleShowHeroModal = async () => {
    // Aquí se simula la obtención de los datos del Héroe.
    // En una implementación real, podrías hacer una llamada a una API para obtener los datos.
    const dummyHeroContact = {
      name: "Juan Pérez",
      email: "juan.perez@example.com",
      whatsapp: "1234567890",
    };

    setHeroContact(dummyHeroContact);
    setShowHeroModal(true);
  };

  const closeHeroModal = () => {
    setShowHeroModal(false);
    setHeroContact(null);
  };

  const TypeIcon = pet.type === "perro" ? FaDog : FaCat;
  const typeColor =
    pet.type === "perro"
      ? "bg-blue-100 text-blue-800"
      : "bg-orange-100 text-orange-800";

  return (
    <motion.div
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 relative"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.3 } }}
    >
      {/* Botón de eliminación */}
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className={`absolute top-3 right-3 p-2 rounded-full z-20 transition-all ${
          isDeleting
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-red-500 hover:bg-red-600"
        }`}
        aria-label="Eliminar mascota"
      >
        <FaTrash className="text-white text-lg" />
      </button>

      {/* Contenedor de imagen */}
      <div className="relative h-48 w-full overflow-hidden bg-gray-50 rounded-t-xl">
        {!imageError && pet.photoUrl ? (
          <Image
            src={pet.photoUrl}
            alt={pet.name}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
            unoptimized
            onError={handleImageError}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
            <FaRegSadTear className="text-6xl mb-2" />
            <span className="text-sm">Imagen no disponible</span>
          </div>
        )}
      </div>

      {/* Contenido de la tarjeta */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-semibold text-gray-800 truncate">
            {pet.name}
          </h3>
          <span
            className={`${typeColor} px-3 py-1 rounded-full text-sm min-w-[70px] text-center`}
          >
            <TypeIcon className="inline-block mr-1" />
            {pet.type}
          </span>
        </div>

        {pet.description && (
          <div className="mb-4">
            <p className={`text-gray-600 ${showFullDescription ? "" : "line-clamp-2"}`}>
              {pet.description}
            </p>
            {pet.description.length > 100 && (
              <button
                onClick={toggleDescription}
                className="text-blue-600 hover:text-blue-800 text-sm mt-1"
              >
                {showFullDescription ? "Ver menos" : "Ver más"}
              </button>
            )}
          </div>
        )}

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">
            Registrado:{" "}
            {new Date(pet.createdAt).toLocaleDateString("es-ES", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </span>
          {/* Botón de alerta: en lugar de redirigir, muestra el modal con la info del Héroe */}
          <button
            onClick={handleShowHeroModal}
            className="flex items-center text-blue-900 hover:text-blue-800 transition-colors"
          >
            <FaInfoCircle className="mr-1" />
            Alerta
          </button>
        </div>
      </div>

      {showHeroModal && heroContact && (
        <HeroContactModal
          isOpen={showHeroModal}
          onClose={closeHeroModal}
          heroContact={heroContact}
        />
      )}
    </motion.div>
  );
};

export default PetCard;



 