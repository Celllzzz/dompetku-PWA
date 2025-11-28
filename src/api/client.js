import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // Mengambil https://api-dompetku.vercel.app/api
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const storedUser = localStorage.getItem("user_dompetku");
  
  if (storedUser) {
    try {
      const user = JSON.parse(storedUser);
      // Jika user login, ambil ID-nya dan tempel ke header
      if (user?.id) {
        config.headers['user-id'] = user.id; 
      }
    } catch (error) {
      console.error("Gagal membaca user data:", error);
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default apiClient;