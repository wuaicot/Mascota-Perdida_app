import { useState } from "react";
import axios from "axios";

export default function RegisterPet() {
  const [formData, setFormData] = useState({
    name: "",
    type: "dog",
    description: "",
    photo: null
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [registeredPet, setRegisteredPet] = useState(null);

  const handleFileChange = (e) => {
    setFormData({ ...formData, photo: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      // Subir imagen si existe
      let photoUrl = "";
      if (formData.photo) {
        const photoData = new FormData();
        photoData.append("file", formData.photo);
        const uploadRes = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/upload`,
          photoData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        photoUrl = uploadRes.data.url;
      }

      // Enviar datos de la mascota
      const petData = {
        name: formData.name,
        type: formData.type,
        description: formData.description,
        photoUrl
      };

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/pets`,
        petData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSuccessMessage("Mascota registrada exitosamente");
      setRegisteredPet(res.data.pet);
    } catch (error) {
      setError(error.response?.data?.error || "Error al registrar la mascota");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Registrar Mascota</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nombre</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Tipo</label>
            <select
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <option value="dog">Perro</option>
              <option value="cat">Gato</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Descripción</label>
            <textarea
              className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Foto</label>
            <input
              type="file"
              className="w-full p-2 border rounded-md"
              onChange={handleFileChange}
            />
          </div>

          {error && <div className="p-3 bg-red-50 text-red-700 rounded-md">{error}</div>}
          {successMessage && <div className="p-3 bg-green-50 text-green-700 rounded-md">{successMessage}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400"
          >
            {loading ? "Registrando..." : "Registrar Mascota"}
          </button>
        </form>
      </div>

      {registeredPet && (
        <div className="mt-6 bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
          <h3 className="text-xl font-bold text-gray-800">Mascota Registrada</h3>
          <p><strong>Nombre:</strong> {registeredPet.name}</p>
          <p><strong>Tipo:</strong> {registeredPet.type}</p>
          <p><strong>Descripción:</strong> {registeredPet.description}</p>
          {registeredPet.photoUrl && <img src={registeredPet.photoUrl} alt="Mascota" className="mt-4 rounded-md" />}
        </div>
      )}
    </div>
  );
}
