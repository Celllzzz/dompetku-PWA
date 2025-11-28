import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../api/client';
import { useToast } from '../context/ToastContext';
import { Wallet, ArrowRight, User, CreditCard, Mail, Lock } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({ name: '', nim: '', email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await apiClient.post('/auth/register', formData);
      showToast('Registrasi berhasil! Silakan login.', 'success');
      navigate('/login');
    } catch (error) {
      showToast('Gagal daftar. Email mungkin sudah ada.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decoration (Senada dengan Login) */}
      <div className="absolute top-0 left-0 w-full h-64 bg-blue-600 md:hidden"></div>
      <div className="hidden md:block absolute top-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-100 rounded-full blur-3xl opacity-50"></div>
      <div className="hidden md:block absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-100 rounded-full blur-3xl opacity-50"></div>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden relative z-10 animate-popup-in">
        <div className="p-8">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-600 p-3 rounded-2xl text-white shadow-lg shadow-blue-200">
              <Wallet size={32} />
            </div>
          </div>
          
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Buat Akun Baru</h1>
            <p className="text-gray-500 text-sm">Mulai kelola keuanganmu hari ini</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nama Lengkap */}
            <div>
              <label className="text-sm font-medium text-gray-700 ml-1 mb-1 block">Nama Lengkap</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={18} className="text-gray-400" />
                </div>
                <input 
                  type="text" 
                  placeholder="Contoh: Budi Santoso"
                  className="w-full pl-10 p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
            </div>

            {/* NIM */}
            <div>
              <label className="text-sm font-medium text-gray-700 ml-1 mb-1 block">NIM</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CreditCard size={18} className="text-gray-400" />
                </div>
                <input 
                  type="text" 
                  placeholder="Nomor Induk Mahasiswa"
                  className="w-full pl-10 p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  onChange={e => setFormData({...formData, nim: e.target.value})}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-medium text-gray-700 ml-1 mb-1 block">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-400" />
                </div>
                <input 
                  type="email" 
                  placeholder="nama@email.com"
                  className="w-full pl-10 p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium text-gray-700 ml-1 mb-1 block">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  className="w-full pl-10 p-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  required
                />
              </div>
            </div>

            <button 
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-blue-300 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? 'Mendaftarkan...' : <>Daftar Sekarang <ArrowRight size={18}/></>}
            </button>
          </form>
          
          <p className="mt-6 text-center text-sm text-gray-500">
            Sudah punya akun? <Link to="/login" className="text-blue-600 font-bold hover:underline">Masuk</Link>
          </p>
        </div>
      </div>
    </div>
  );
}