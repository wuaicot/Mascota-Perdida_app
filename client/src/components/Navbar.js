// client/src/components/Navbar.js
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="bg-purple-200 shadow-sm mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link
              href="/owner/dashboard"
              className="text-xl font-bold text-blue-600"
            >
              Super-Collar Dueños
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/owner/dashboard"
              className="text-gray-700 hover:text-blue-600 px-3 py-2"
            >
              Estás en el panel mascotas
            </Link>
            <button
              onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/";
              }}
              className="text-red-500 hover:text-red-600 px-3 py-2"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
