// //client/src/components/NavBarHeroe.js

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Menu, X, Home, User, LogOut } from "lucide-react";
import Marquee from "react-fast-marquee";

const NavBarHeroe = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <nav className="bg-blue-950 text-white shadow-lg rounded-lg">
      {/* Cinta de advertencia */}
      <Marquee speed={50} gradient={false} className="bg-yellow-300 text-red-500 py-1 text-sm">
        <strong>Esta app está en desarrollo, puede que no funcione correctamente 👁️‍🗨️</strong>
      </Marquee>
      
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold tracking-wide flex items-center gap-2">
          🦸‍♂️ HeroDash
        </Link>

        {/* Menú hamburguesa (Móvil) */}
        <button className="lg:hidden text-white focus:outline-none" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Links en pantallas grandes */}
        <ul className="hidden lg:flex space-x-6 text-lg">
          <NavItem to="/dashboard" icon={<Home size={20} />} text="Inicio" />
          <NavItem to="/perfil" icon={<User size={20} />} text="Perfil" />
          <li className="flex items-center gap-2 cursor-pointer hover:text-blue-400 transition-colors" onClick={handleLogout}>
            <LogOut size={20} /> Salir
          </li>
        </ul>
      </div>

      {/* Menú desplegable (Móvil) */}
      {isOpen && (
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="lg:hidden bg-gray-800">
          <ul className="flex flex-col items-center space-y-4 py-4 text-lg">
            <NavItem to="/dashboard" icon={<Home size={20} />} text="Inicio" />
            <NavItem to="/perfil" icon={<User size={20} />} text="Perfil" />
            <li className="flex items-center gap-2 cursor-pointer hover:text-blue-400 transition-colors" onClick={handleLogout}>
              <LogOut size={20} /> Salir
            </li>
          </ul>
        </motion.div>
      )}
    </nav>
  );
};

// Componente de Item reutilizable
const NavItem = ({ to, icon, text }) => (
  <motion.li whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="flex items-center gap-2 hover:text-blue-400 transition-colors">
    {icon}
    <Link href={to}>{text}</Link>
  </motion.li>
);

export default NavBarHeroe;
