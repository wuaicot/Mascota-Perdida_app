import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-blue-600 mb-8 animate-pulse">
        PetFinder
      </h1>
      
      <div className="space-y-4 w-full max-w-xs">
        <Link href="/auth/register" className="block">
          <button className="w-full py-3 px-6 bg-blue-500 text-white rounded-lg hover:bg-blue-600 
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all">
            Registrarme como Dueño
          </button>
        </Link>
        
        <Link href="/hero" className="block">
          <button className="w-full py-3 px-6 bg-green-500 text-white rounded-lg hover:bg-green-600 
            focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all">
            Encontré una Mascota
          </button>
        </Link>

        
          <p className="mt-4 text-center text-md text-gray-600">
          ¿Ya tienes cuenta?{' '}
          <Link href="/auth/login" className="text-blue-600 hover:text-green-700 animate-pulse font-semibold ">
            Inicia Sesión→
          </Link>
        </p>
        
      </div>
    </div>
  );
}