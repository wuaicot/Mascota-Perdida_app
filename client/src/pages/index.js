import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-blue-600 mb-8">PetFinder</h1>
      <div className="space-y-4">
        <Link href="/auth/login">
          <button className="w-64 py-3 px-6 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            Soy Dueño
          </button>
        </Link>
        <Link href="/hero">
          <button className="w-64 py-3 px-6 bg-green-500 text-white rounded-lg hover:bg-green-600">
            Encontré una Mascota
          </button>
        </Link>
      </div>
    </div>
  );
}