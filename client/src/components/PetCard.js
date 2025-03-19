//client/src/components/PetCard.js
import Image from 'next/image';
import { useState } from 'react';
import { FaDog, FaCat, FaTrash, FaInfoCircle, FaRegSadTear } from 'react-icons/fa';
import axios from 'axios';
import { useRouter } from 'next/router';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const PetCard = ({ pet, onDelete }) => {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  console.log("Imagen de la mascota:", pet.photoUrl); // Para depuración

  const handleDelete = async () => {
    if (!confirm(`¿Seguro que quieres eliminar a ${pet.name} permanentemente?`)) return;
    
    try {
      setIsDeleting(true);
      await axios.delete(`${API_BASE_URL}/api/pets/${pet.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt')}`
        }
      });
      onDelete(pet.id);
    } catch (error) {
      console.error('Error eliminando mascota:', error);
      alert(error.response?.data?.error || 'Error al eliminar la mascota');
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

  const TypeIcon = pet.type === 'perro' ? FaDog : FaCat;
  const typeColor = pet.type === 'perro' ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800';

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 relative">
      {/* Botón de eliminación */}
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className={`absolute top-3 right-3 p-2 rounded-full z-20 transition-all ${
          isDeleting 
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-red-500 hover:bg-red-600'
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
          <h3 className="text-xl font-semibold text-gray-800 truncate">{pet.name}</h3>
          <span className={`${typeColor} px-3 py-1 rounded-full text-sm min-w-[70px] text-center`}>
            <TypeIcon className="inline-block mr-1" />
            {pet.type}
          </span>
        </div>

        {pet.description && (
          <div className="mb-4">
            <p className={`text-gray-600 ${showFullDescription ? '' : 'line-clamp-2'}`}>
              {pet.description}
            </p>
            {pet.description.length > 100 && (
              <button
                onClick={toggleDescription}
                className="text-blue-600 hover:text-blue-800 text-sm mt-1"
              >
                {showFullDescription ? 'Ver menos' : 'Ver más'}
              </button>
            )}
          </div>
        )}

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">
            Registrado: {new Date(pet.createdAt).toLocaleDateString('es-ES', {
              day: '2-digit',
              month: 'long',
              year: 'numeric'
            })}
          </span>
          <button
            onClick={() => router.push(`/pets/${pet.id}`)}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
          >
            <FaInfoCircle className="mr-1" />
            Detalles
          </button>
        </div>
      </div>
    </div>
  );
};

export default PetCard;

