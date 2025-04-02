import Link from "next/link";
import Marquee from "react-fast-marquee";

const Navbar = () => {
  // return (
  //   <nav className="relative bg-purple-200 shadow-sm">
  //     {/* Cinta de aviso animada */}
  //     <div className="bg-red-600 text-white py-1 text-sm font-semibold">
  //       <Marquee gradient={false} speed={50}>
  //         👁️‍🗨️ Esta app está en desarrollo, puede que no funcione correctamente 👁️‍🗨️
  //       </Marquee>
  //     </div>

  //     {/* Contenedor principal del Navbar */}
  //     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  //       <div className="flex justify-between items-center h-16">
  //         <Link
  //           href="/owner/dashboard"
  //           className="text-xl font-bold text-blue-600"
  //         >
  //           Super-Collar Dueños
  //         </Link>
  //         <div className="flex items-center space-x-4">
  //           <Link
  //             href="/owner/dashboard"
  //             className="text-gray-700 hover:text-blue-600 px-3 py-2"
  //           >
  //             Estás en el panel mascotas
  //           </Link>
  //           <button
  //             onClick={() => {
  //               localStorage.removeItem("token");
  //               window.location.href = "/";
  //             }}
  //             className="text-red-500 hover:text-red-600 px-3 py-2"
  //           >
  //             Cerrar Sesión
  //           </button>
  //         </div>
  //       </div>
  //     </div>
  //   </nav>
  // );
};

export default Navbar;
