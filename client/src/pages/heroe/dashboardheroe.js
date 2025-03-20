import React, { useState } from "react";
import dynamic from "next/dynamic";
import QRScanner from "../../components/QRScanner";
import AdCarousel from "../../components/AdCarousel";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";


// Se importa el mapa de manera dinámica (sin SSR) para evitar errores de renderizado
const LostPetsMap = dynamic(() => import("../../components/LostPetsMap"), {
  ssr: false,
});


 

// Componente de línea de tiempo para seguir el proceso de devolución de la mascota

const Timeline = () => {
  return (
    
    <div className="p-4 bg-white shadow rounded-lg">
      <h2 className="text-xl font-semibold mb-2">Seguimiento del proceso</h2>
      <ul className="space-y-4">
        <li>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
            <span>Mascota encontrada</span>
          </div>
          <p className="ml-6 text-gray-600 text-sm">
            La mascota fue escaneada y reportada.
          </p>
        </li>
        <li>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></div>
            <span>Dueño notificado</span>
          </div>
          <p className="ml-6 text-gray-600 text-sm">
            Se envió la notificación al dueño.
          </p>
        </li>
        <li>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
            <span>Proceso en curso</span>
          </div>
          <p className="ml-6 text-gray-600 text-sm">
            Esperando confirmación de entrega.
          </p>
        </li>
        <li>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-500 rounded-full mr-2"></div>
            <span>Mascota devuelta</span>
          </div>
          <p className="ml-6 text-gray-600 text-sm">
            La mascota ha sido entregada al dueño.
          </p>
        </li>
      </ul>
    </div>
  );
};

const DashboardHeroe = () => {
  // Estado para alternar entre la vista de escáner y la de mapa
  const [view, setView] = useState("scanner"); // 'scanner' o 'map'

  // Datos simulados para el mapa (debe reemplazarse con datos reales)
  const lostPets = [
    {
      id: 1,
      name: "Firulais",
      description: "Perro muy amigable",
      location: { lat: 40.7128, lng: -74.006 },
    },
    {
      id: 2,
      name: "Misu",
      description: "Gata dormilona",
      location: { lat: 34.0522, lng: -118.2437 },
    },
  ];

  return (
    
    
    <div className="min-h-screen bg-purple-300 p-4">
      <div><Link
    href="/"
    className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
  >
    <FaArrowLeft className="mr-2" />
    Volver al inicio
  </Link> 
</div> 
      


      {/* Encabezado */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-center">Dashboard del Héroe</h1>
      </header>
      

      <div className="space-y-8">
        
        {/* Sección: Escaneo de código QR */}
        <section className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Escanear código QR</h2>
          <p className="text-gray-600 mb-4">
            Utiliza la cámara para escanear el código QR del collar y notificar
            al dueño.
          </p>
          <QRScanner />
        </section>

        {/* Sección: Mapa / Alternador de vistas */}
        <section className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Mascotas Perdidas</h2>
            <div>
              <button
                onClick={() => setView("scanner")}
                className={`px-4 py-2 mr-2 rounded ${
                  view === "scanner"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                Vista Scanner
              </button>
              <button
                onClick={() => setView("map")}
                className={`px-4 py-2 rounded ${
                  view === "map"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                Vista Mapa
              </button>
            </div>
          </div>
          {view === "map" ? (
            <div className="h-80">
              <LostPetsMap lostPets={lostPets} />
            </div>
          ) : (
            <div className="flex justify-center items-center h-64 border rounded">
              <p className="text-gray-500">
                Activa la cámara para escanear o cambia a la vista de mapa.
              </p>
            </div>
          )}
        </section>

        {/* Sección: Línea de tiempo */}
        <section>
          <Timeline />
        </section>

        {/* Sección: Carrusel de publicidad */}
        <section className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Publicidad</h2>
          <AdCarousel />
        </section>
        
      </div>
      
    </div>
    
  );
  
};


export default DashboardHeroe;


  
