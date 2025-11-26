    import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Wallet } from 'lucide-react';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Endpoint sesuai struktur routes backend tadi
      const res = await apiClient.post('/auth/login', formData);
      
      // Simpan data user (res.data.user) ke context
      login(res.data.user); 
      showToast(`Selamat datang, ${res.data.user.name}!`, 'success');
      navigate('/');
    } catch (error) {
      showToast('Email atau Password salah', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 animate-fade-in">
      <div className="bg-blue-600 p-3 rounded-2xl text-white mb-6 shadow-lg shadow-blue-200">
        <Wallet size={32} />
      </div>
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Welcome Back!</h1>
      <p className="text-gray-400 mb-8 text-sm">Silakan login untuk melanjutkan</p>

      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <label className="text-sm font-medium text-gray-700 ml-1">Email</label>
          <input 
            type="email" 
            className="w-full p-3 border rounded-xl mt-1 bg-gray-50 focus:bg-white transition-colors"
            onChange={e => setFormData({...formData, email: e.target.value})}
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 ml-1">Password</label>
          <input 
            type="password" 
            className="w-full p-3 border rounded-xl mt-1 bg-gray-50 focus:bg-white transition-colors"
            onChange={e => setFormData({...formData, password: e.target.value})}
            required
          />
        </div>
        <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-blue-200 hover:scale-[1.02] transition-transform">
          Masuk Sekarang
        </button>
      </form>
      
      <p className="mt-6 text-sm text-gray-500">
        Belum punya akun? <Link to="/register" className="text-blue-600 font-bold">Daftar</Link>
      </p>
    </div>
  );
}