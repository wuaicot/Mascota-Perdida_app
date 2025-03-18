import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        email,
        password
      });

      // Almacenar el token en localStorage
      localStorage.setItem('jwt', res.data.token);

      // Redirigir al dashboard
      router.push('/owner/dashboard?refresh=' + Date.now());
    } catch (error) {
      console.error('Error en el login:', error);
      setError(error.response?.data?.error || 'Credenciales incorrectas');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Inicio de sesión Dueño</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Email</label>
          <input
            type="email"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Contraseña</label>
          <input
            type="password"
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
        >
          Ingresar
        </button>

        <p className="mt-4 text-center">
          ¿No tienes cuenta? 
          <a href="/auth/register" className="text-blue-600 ml-2 hover:text-blue-800">
            Regístrate aquí
          </a>
        </p>
      </form>
    </div>
  );
}