// client/src/pages/pets/new.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { FaDog, FaCat, FaUpload, FaArrowLeft, FaSignOutAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

const PetForm = () => {
  const router = useRouter();
  const { width, height } = useWindowSize();
  const [form, setForm] = useState({ 
    name: '', 
    type: 'perro', 
    description: '',
    photo: null
  });
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState('');
  const [error, setError] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);

  // Verificar autenticación
  useEffect(() => {
    if(!localStorage.getItem('jwt')) {
      router.push('/auth/login');
    }
  }, [router]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if(file.size > 5 * 1024 * 1024) {
      setError('El archivo no puede ser mayor a 5MB');
      return;
    }
    setForm({ ...form, photo: file });
    setPreview(URL.createObjectURL(file));
    setError('');
  };

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    router.push('/auth/login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('type', form.type);
      formData.append('description', form.description);
      formData.append('photo', form.photo);

      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/pets`, formData, {
        headers: { 
          Authorization: `Bearer ${localStorage.getItem('jwt')}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      // Mostrar efecto de confetti y reproducir trompeta
      toast.success("Mascota registrada con éxito");
      setShowConfetti(true);
      const audio = new Audio('/trumpet.mp3'); // Asegúrate de colocar 'trumpet.mp3' en la carpeta public
      audio.play();

      //tiempo de duración del confetti
      setTimeout(() => {
        setShowConfetti(false);
        router.push('/owner/dashboard');
      }, 3500);
    } catch (error) {
      setError(error.response?.data?.error || 'Error al registrar la mascota');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 relative">
      {/* Confetti de fanfarria */}
      {showConfetti && <Confetti width={width} height={height} recycle={false} numberOfPieces={500} />}
      
      {/* Header de navegación */}
      <div className="max-w-2xl mx-auto mb-6 flex justify-between items-center">
        <button 
          onClick={() => router.push('/owner/dashboard')}
          className="text-blue-600 hover:text-blue-800 flex items-center"
        >
          <FaArrowLeft className="mr-2" />
          Volver al Dashboard
        </button>
        
        <button
          onClick={handleLogout}
          className="text-red-600 hover:text-red-800 flex items-center"
        >
          <FaSignOutAlt className="mr-2" />
          Cerrar Sesión
        </button>
      </div>

      {/* Formulario */}
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
          <FaDog className="mr-2" />
          Registrar Nueva Mascota
        </h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campo Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de la mascota *
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          {/* Campo Tipo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de mascota *
            </label>
            <div className="flex items-center space-x-2">
              {form.type === "perro" ? <FaDog /> : <FaCat />}
              <select
                className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                <option value="perro">Perro</option>
                <option value="gato">Gato</option>
              </select>
            </div>
          </div>

          {/* Campo Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              className="w-full p-2 border rounded-md h-32 focus:ring-2 focus:ring-blue-500"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Ej: Collar rojo, mancha en la oreja izquierda..."
            />
          </div>

          {/* Campo Foto */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Foto de la mascota *
            </label>
            <div className="flex items-center space-x-4">
              <label className="cursor-pointer bg-blue-100 text-blue-700 px-4 py-2 rounded-md hover:bg-blue-200 transition-colors">
                <FaUpload className="inline mr-2" />
                Subir imagen
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept="image/*"
                  required
                />
              </label>
              {preview && (
                <img 
                  src={preview} 
                  alt="Preview" 
                  className="w-20 h-20 object-cover rounded-md border"
                />
              )}
            </div>
            <p className="text-sm text-gray-500 mt-2">Formatos soportados: JPG, PNG, WEBP (Máx. 5MB)</p>
          </div>

          {/* Botón de enviar */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex justify-center items-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Registrando...
              </>
            ) : (
              'Registrar Mascota'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PetForm;
