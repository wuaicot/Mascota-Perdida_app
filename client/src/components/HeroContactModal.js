import { createPortal } from 'react-dom';

const HeroContactModal = ({ isOpen, onClose, heroContact }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Fondo semitransparente */}
      <div
        className="absolute inset-0 bg-black opacity-50"
        onClick={onClose}
      />
      {/* Contenido del Modal */}
      <div className="bg-white rounded-lg shadow-lg z-10 p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">
          Información de Contacto del Héroe
        </h2>
        <p>
          <strong>Nombre:</strong> {heroContact.name}
        </p>
        <p>
          <strong>Correo:</strong> {heroContact.email}
        </p>
        <p>
          <strong>WhatsApp:</strong>{' '}
          <a
            href={`https://wa.me/${heroContact.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            {heroContact.whatsapp}
          </a>
        </p>
        <button
          onClick={onClose}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Cerrar
        </button>
      </div>
    </div>,
    document.body
  );
};

export default HeroContactModal;
