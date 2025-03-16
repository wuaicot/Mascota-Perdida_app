import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Layout from '../../components/Layout'; // Opcional: crear layout común

const Dashboard = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/pets`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPets(res.data);
      } catch (error) {
        console.error('Error fetching pets:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPets();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Cargando mascotas...</p>
      </div>
    );
  }

  return (
    <Layout> {/* Si usas un layout */}
      <div className="p-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">
            Mis Mascotas Registradas
          </h1>
          <Link 
            href="/pets/new"
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors"
          >
            + Registrar Nueva Mascota
          </Link>
        </div>

        {pets.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No tienes mascotas registradas</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pets.map((pet) => (
              <div 
                key={pet.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{pet.name}</h3>
                  <p className="text-sm text-gray-500 mb-4 capitalize">Especie: {pet.type}</p>
                  <div className="flex justify-between items-center">
                    <Link 
                      href={`/pets/${pet.id}/alerts`}
                      className="text-blue-500 hover:text-blue-600 text-sm"
                    >
                      Ver alertas
                    </Link>
                    <span className="text-xs text-gray-400">
                      Registrado el: {new Date(pet.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;