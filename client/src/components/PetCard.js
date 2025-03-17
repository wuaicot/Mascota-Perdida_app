//client/src/components/PetCard.js
import Image from 'next/image';
import { FaDog, FaCat } from 'react-icons/fa';

const PetCard = ({ pet }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {pet.photoUrl ? (
        <div className="relative h-48">
          <Image
            src={pet.photoUrl}
            alt={pet.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />
        </div>
      ) : (
        <div className="h-48 bg-gray-100 flex items-center justify-center">
          {pet.type === 'perro' ? (
            <FaDog className="text-6xl text-gray-400" />
          ) : (
            <FaCat className="text-6xl text-gray-400" />
          )}
        </div>
      )}

      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{pet.name}</h3>
        <div className="flex items-center mb-2">
          <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm capitalize">
            {pet.type}
          </span>
        </div>
        {pet.description && (
          <p className="text-gray-600 mb-4">{pet.description}</p>
        )}
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">
            Registrado: {new Date(pet.createdAt).toLocaleDateString()}
          </span>
          <button className="text-blue-600 hover:text-blue-800 text-sm">
            Ver detalles
          </button>
        </div>
      </div>
    </div>
  );
};

export default PetCard;