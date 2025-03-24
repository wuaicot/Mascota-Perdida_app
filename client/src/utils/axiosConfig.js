// client/src/utils/axiosConfig.js
import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true
});

// Interceptor para agregar token automáticamente
instance.interceptors.request.use(config => {
  const token = localStorage.getItem('jwt');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // Nota: withCredentials se establece a nivel de configuración, no en los headers
  return config;
});

export default instance;
