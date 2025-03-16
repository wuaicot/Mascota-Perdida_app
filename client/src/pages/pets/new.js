import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { FaDog, FaCat, FaUpload } from 'react-icons/fa';

const PetForm = () => {
  const router = useRouter();
  const [form, setForm] = useState({ 
    name: '', 
    type: 'perro', 
    description: '',
    photo: null
  });
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setForm({ ...form, photo: file });
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('type', form.type);
      formData.append('description', form.description);
      formData.append('photo', form.photo);

      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/pets`, formData, {
        headers: { 
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      router.push('/owner/dashboard');
    } catch (error) {
      alert('Error al registrar mascota');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Registrar Nueva Mascota
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Campo Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de la mascota
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          {/* Campo Tipo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo
            </label>
            <select
              className="w-full p-2 border rounded-md"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            >
              <option value="perro"><FaDog className="inline mr-2" /> Perro</option>
              <option value="gato"><FaCat className="inline mr-2" /> Gato</option>
            </select>
          </div>

          {/* Campo Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción
            </label>
            <textarea
              className="w-full p-2 border rounded-md h-32"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          {/* Campo Foto */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Foto de la mascota
            </label>
            <div className="flex items-center space-x-4">
              <label className="cursor-pointer bg-blue-100 text-blue-700 px-4 py-2 rounded-md hover:bg-blue-200">
                <FaUpload className="inline mr-2" />
                Subir imagen
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </label>
              {preview && (
                // eslint-disable-next-line @next/next/no-img-element
                <img 
                  src={preview} 
                  alt="Preview" 
                  className="w-20 h-20 object-cover rounded-md"
                />
              )}
            </div>
          </div>

          {/* Botón de enviar */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? 'Registrando...' : 'Registrar Mascota'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PetForm;