//client/src/pages/owner/dashboard.js
import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "../../utils/axiosConfig";
import Layout from "../../components/Layout";
import PetCard from "../../components/PetCard";
import { AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Dashboard = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Función para actualizar el estado cuando se elimina una mascota
  const handleDelete = (id) => {
    setPets((prevPets) => prevPets.filter((pet) => pet.id !== id));
  };

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const token = localStorage.getItem("jwt");
        if (!token) {
          console.error("⚠️ No hay token en localStorage");
          setLoading(false);
          return;
        }

        const res = await axios.get(`/api/pets`, {
          headers: {
            "X-Requested-With": "XMLHttpRequest",
          },
        });
        setPets(res.data);
        setLoading(false);
      } catch (error) {
        console.error("Error:", error.response?.data);
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
    <Layout>
      {/* Contenedor para notificaciones */}
      <ToastContainer position="top-right" autoClose={3000} />
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
            <AnimatePresence>
              {pets.map((pet) => (
                <PetCard key={pet.id} pet={pet} onDelete={handleDelete} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;

{
  /*   
     <header>
        <NavBarOwner />
      </header> 
  */
}
