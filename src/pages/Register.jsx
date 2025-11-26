import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '../api/client';
import { useToast } from '../context/ToastContext';

export default function Register() {
  const [formData, setFormData] = useState({ name: '', nim: '', email: '', password: '' });
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post('/auth/register', formData);
      showToast('Registrasi berhasil! Silakan login.', 'success');
      navigate('/login');
    } catch (error) {
      showToast('Gagal daftar. Email mungkin sudah ada.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Buat Akun Baru</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <input type="text" placeholder="Nama Lengkap" className="w-full p-3 border rounded-xl" onChange={e => setFormData({...formData, name: e.target.value})} required />
        <input type="text" placeholder="NIM" className="w-full p-3 border rounded-xl" onChange={e => setFormData({...formData, nim: e.target.value})} required />
        <input type="email" placeholder="Email" className="w-full p-3 border rounded-xl" onChange={e => setFormData({...formData, email: e.target.value})} required />
        <input type="password" placeholder="Password" className="w-full p-3 border rounded-xl" onChange={e => setFormData({...formData, password: e.target.value})} required />
        <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:scale-[1.02] transition-transform">Daftar</button>
      </form>
      <p className="mt-6 text-sm text-gray-500">
        Sudah punya akun? <Link to="/login" className="text-blue-600 font-bold">Login</Link>
      </p>
    </div>
  );
}