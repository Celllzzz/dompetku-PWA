import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/client'; // Import helper API kita
import { ArrowLeft, Save } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function AddTransaction() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();
  
  // State untuk form input
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    type: 'expense', // Default pengeluaran
    category_id: ''
  });

  // 1. Ambil data Kategori saat halaman dibuka (menggunakan apiClient)
  useEffect(() => {
    apiClient.get('/categories')
      .then(res => {
        setCategories(res.data);
      })
      .catch(err => {
        console.error("Gagal mengambil kategori:", err);
        alert("Gagal memuat kategori, pastikan backend nyala!");
      });
  }, []);

  // 2. Fungsi Simpan Transaksi (menggunakan apiClient)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // POST ke /transactions (URL dasar sudah diatur di client.js)
      await apiClient.post('/transactions', formData);
      
      showToast('Transaksi berhasil disimpan!', 'success'); 
      navigate('/');
    } catch (error) {
      console.error("Error submit:", error);
      alert('Gagal menyimpan transaksi. Cek console untuk detail.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header Sederhana */}
      <div className="bg-white p-4 flex items-center gap-4 shadow-sm sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft size={24} className="text-gray-700" />
        </button>
        <h1 className="font-bold text-lg text-gray-800">Tambah Transaksi</h1>
      </div>

      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Input Judul */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Judul Transaksi</label>
            <input 
              type="text" 
              placeholder="Contoh: Nasi Padang"
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})} 
              required 
            />
          </div>

          {/* Input Nominal */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nominal (Rp)</label>
            <input 
              type="number" 
              placeholder="0"
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
              value={formData.amount}
              onChange={e => setFormData({...formData, amount: e.target.value})} 
              required 
            />
          </div>

          {/* Input Tipe (Pemasukan/Pengeluaran) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tipe</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({...formData, type: 'expense'})}
                className={`p-3 rounded-xl font-medium border transition-all ${
                  formData.type === 'expense' 
                    ? 'bg-red-50 border-red-500 text-red-600' 
                    : 'bg-white border-gray-200 text-gray-500'
                }`}
              >
                Pengeluaran
              </button>
              <button
                type="button"
                onClick={() => setFormData({...formData, type: 'income'})}
                className={`p-3 rounded-xl font-medium border transition-all ${
                  formData.type === 'income' 
                    ? 'bg-green-50 border-green-500 text-green-600' 
                    : 'bg-white border-gray-200 text-gray-500'
                }`}
              >
                Pemasukan
              </button>
            </div>
          </div>

          {/* Input Kategori */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kategori</label>
            <select 
              className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
              value={formData.category_id}
              onChange={e => setFormData({...formData, category_id: e.target.value})} 
              required
            >
              <option value="">-- Pilih Kategori --</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name} ({cat.type === 'income' ? '+' : '-'})
                </option>
              ))}
            </select>
          </div>

          {/* Tombol Simpan */}
          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full py-4 rounded-xl font-bold text-white flex items-center justify-center gap-2 shadow-lg transition-all ${
              isLoading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
            }`}
          >
            <Save size={20} />
            {isLoading ? 'Menyimpan...' : 'Simpan Transaksi'}
          </button>

        </form>
      </div>
    </div>
  );
}