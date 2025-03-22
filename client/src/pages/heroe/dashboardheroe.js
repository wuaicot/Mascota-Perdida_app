//client/src/pages/heroe/dashboardheroe.js

import React, { useState } from "react";
import dynamic from "next/dynamic";
import QRScanner from "../../components/QRScanner";
import AdCarousel from "../../components/AdCarousel";
import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import NavBarHeroe from "../../components/NavBarHeroe";
import { motion } from "framer-motion";
import Image from "next/image";

const LostPetsMap = dynamic(() => import("../../components/LostPetsMap"), {
  ssr: false,
});

const Timeline = () => {
  return (
    <div className="p-4 bg-slate-100 shadow rounded-lg">
      <h2 className="text-xl font-semibold mb-2">Seguimiento del proceso</h2>
      <ul className="space-y-4">
        {[
          {
            status: "Mascota encontrada",
            color: "green",
            desc: "La mascota fue escaneada y reportada.",
          },
          {
            status: "Dueño notificado",
            color: "yellow",
            desc: "Se envió la notificación al dueño.",
          },
          {
            status: "Proceso en curso",
            color: "blue",
            desc: "Esperando confirmación de entrega.",
          },
          {
            status: "Mascota devuelta",
            color: "gray",
            desc: "La mascota ha sido entregada al dueño.",
          },
        ].map((step, index) => (
          <li key={index}>
            <div className="flex items-center">
              <div
                className={`w-4 h-4 bg-${step.color}-500 rounded-full mr-2`}
              ></div>
              <span>{step.status}</span>
            </div>
            <p className="ml-6 text-gray-600 text-sm">{step.desc}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

const FancyHello = () => {
  return (
    <div className="flex flex-col items-center justify-center text-white py-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
      >
        <Image
          src="/ads/hello-img.png"
          alt="Hello"
          width={200}
          height={200}
          priority={true}
        />
      </motion.div>

      <motion.h1
        className="text-5xl font-extrabold text-center mt-4 mb-4"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        ¡HOLA!
      </motion.h1>

      <motion.p
        className="text-lg text-center mt-2 px-6 py-2 bg-black bg-opacity-30 rounded-lg shadow-lg neon-glow"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        Bienvenido a la comunidad de héroes
      </motion.p>

      <style jsx>{`
        .neon-glow {
          text-shadow: 0 0 5px #fff, 0 0 10px #ff00ff, 0 0 20px #ff00ff;
        }
      `}</style>
    </div>
  );
};

const DashboardHeroe = () => {
  const [view, setView] = useState("scanner");

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
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 p-4 text-white">
      <header>
        <NavBarHeroe />
      </header>

      <FancyHello />

      <div className="space-y-8">
        <section className="bg-blue-950 p-4 rounded-lg shadow text-black">
          <h2 className="text-xl text-white  font-semibold mb-2 justify-center flex">Escanear el código QR.</h2>
          <p className="text-white mb-4">
            Utiliza la cámara para escanear el código QR del collar y notificar
            al dueño.
          </p>
          <QRScanner />
        </section>

        <section className="bg-slate-100 p-4 rounded-lg shadow text-black">
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

        <section>
          <Timeline />
        </section>

        <section className="bg-orange-500 p-4 rounded-lg shadow w-auto h-auto text-black">
          <h2 className="text-xl text-white font-bold mb-2">
            Tienda Super-Collar
          </h2>
          <AdCarousel />
        </section>
      </div>

      <div>
        <Link
          href="/"
          className="flex items-center text-blue-300 hover:text-blue-500 mb-4"
        >
          <FaArrowLeft className="mr-2" />
          Volver al inicio
        </Link>
      </div>
    </div>
  );
};

export default DashboardHeroe;
