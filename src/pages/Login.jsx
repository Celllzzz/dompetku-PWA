import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Wallet, ArrowRight } from 'lucide-react';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await apiClient.post('/auth/login', formData);
      login(res.data.user); 
      showToast(`Selamat datang kembali, ${res.data.user.name}!`, 'success');
      navigate('/');
    } catch (error) {
      showToast('Email atau Password salah.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decoration for Desktop */}
      <div className="absolute top-0 left-0 w-full h-64 bg-blue-600 md:hidden"></div>
      <div className="hidden md:block absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-100 rounded-full blur-3xl opacity-50"></div>
      <div className="hidden md:block absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-indigo-100 rounded-full blur-3xl opacity-50"></div>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden relative z-10 animate-popup-in">
        <div className="p-8 md:p-10">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-600 p-4 rounded-2xl text-white shadow-lg shadow-blue-200 transform rotate-3">
              <Wallet size={32} />
            </div>
          </div>
          
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back!</h1>
            <p className="text-gray-500 text-sm">Masuk untuk mengelola keuanganmu</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm font-medium text-gray-700 ml-1 mb-1 block">Email</label>
              <input 
                type="email" 
                placeholder="user@email.com"
                className="w-full p-3.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                onChange={e => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 ml-1 mb-1 block">Password</label>
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full p-3.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                onChange={e => setFormData({...formData, password: e.target.value})}
                required
              />
            </div>
            
            <button 
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-blue-300 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Memuat...' : <>Masuk Sekarang <ArrowRight size={18}/></>}
            </button>
          </form>
          
          <p className="mt-8 text-center text-sm text-gray-500">
            Belum punya akun? <Link to="/register" className="text-blue-600 font-bold hover:underline">Daftar Sekarang</Link>
          </p>
        </div>
      </div>
    </div>
  );
}