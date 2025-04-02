import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Marquee from "react-fast-marquee";
import { Menu, X, Home, User, LogOut } from "lucide-react";

const NavBarOwner = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-blue-950 text-white shadow-lg rounded-lg relative  ">
      {/* Cinta de advertencia */}
      <Marquee
        speed={50}
        gradient={false}
        className="bg-red-600 text-white py-1 text-sm"
      >
        <strong>
          Esta app está en desarrollo, puede que no funcione correctamente 👁️‍🗨️
        </strong>
      </Marquee>

      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link
          href="/"
          className="text-2xl font-bold tracking-wide flex items-center gap-2"
        >
          🦸‍♂️ Dueño de Mascota
        </Link>

        {/* Menú hamburguesa (Móvil) */}
        <button
          className="lg:hidden text-white focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Links en pantallas grandes */}
        <ul className="hidden lg:flex space-x-6 text-lg">
          <NavItem
            to="/owner/dashboard"
            icon={<Home size={20} />}
            text="Inicio"
          />
          <NavItem to="/owner/perfil" icon={<User size={20} />} text="Perfil" />
          <NavItem
            to="/"
            icon={<LogOut size={20} />}
            text="Salir"
            onClick={handleLogout}
          />
        </ul>
      </div>

      {/* Menú desplegable (Móvil) */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="lg:hidden bg-gray-800"
        >
          <ul className="flex flex-col items-center space-y-4 py-4 text-lg">
            <NavItem
              to="/owner/dashboard"
              icon={<Home size={20} />}
              text="###"
            />
            <NavItem to="/owner/perfil" icon={<User size={20} />} text="###" />
            <NavItem
              to="/"
              icon={<LogOut size={20} />}
              text="Cerrar sesión"
              onClick={handleLogout}
            />
          </ul>
        </motion.div>
      )}
    </nav>
  );
};

const NavItem = ({ to, icon, text, onClick }) => (
  <motion.li
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    className="flex items-center gap-2 hover:text-blue-400 transition-colors"
  >
    {icon}
    <Link href={to} onClick={onClick}>
      {text}
    </Link>
  </motion.li>
);

const handleLogout = () => {
  localStorage.removeItem("token");
  window.location.href = "/";
};

export default NavBarOwner;
