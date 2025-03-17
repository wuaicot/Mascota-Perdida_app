/* eslint-disable @next/next/no-html-link-for-pages */
import { useEffect, useState } from 'react';
import axios from 'axios';
import PetCard from '../../components/PetCard';
import Layout from '../../components/Layout';

const Dashboard = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/pets`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
        
        setPets(res.data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPets();
  }, []);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Tus Mascotas Registradas</h1>
          <a 
            href="/pets/new"
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors"
          >
            + Nueva Mascota
          </a>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          </div>
        ) : pets.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No hay mascotas registradas</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pets.map((pet) => (
              <PetCard key={pet.id} pet={pet} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;