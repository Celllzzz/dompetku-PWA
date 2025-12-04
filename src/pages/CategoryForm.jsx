import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import apiClient from '../api/client';
import { ArrowLeft, Save, Type } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function CategoryForm() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', type: 'expense' });
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (id) {
      apiClient.get(`/categories/${id}`)
        .then(res => setFormData(res.data))
        .catch(err => showToast("Gagal ambil data", "error"));
    }
  }, [id, showToast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (id) {
        await apiClient.put(`/categories/${id}`, formData);
        showToast('Kategori diperbarui', 'success');
      } else {
        await apiClient.post('/categories', formData);
        showToast('Kategori ditambahkan', 'success');
      }
      navigate('/categories');
    } catch (error) {
      showToast('Gagal menyimpan', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-h-screen bg-gray-50 p-6 animate-fade-in flex flex-col justify-center max-w-xl mx-auto">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-3 bg-white rounded-xl shadow-sm hover:bg-gray-100 transition-colors border border-gray-100">
          <ArrowLeft size={20} className="text-gray-700" />
        </button>
        <h1 className="font-bold text-2xl text-gray-800">{id ? 'Edit Kategori' : 'Kategori Baru'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[2rem] shadow-xl shadow-gray-100 border border-white space-y-6">
        
        {/* Input Nama */}
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Nama Kategori</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Type size={20} className="text-gray-400" />
            </div>
            <input 
              type="text" 
              placeholder="Contoh: Belanja, Gaji"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full pl-12 p-4 border border-gray-200 rounded-2xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none font-bold text-lg text-gray-700 placeholder:font-normal" 
              required 
            />
          </div>
        </div>

        {/* Tipe Selector */}
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 ml-1">Jenis</label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setFormData({...formData, type: 'expense'})}
              className={`p-4 rounded-2xl font-bold border transition-all duration-300 flex flex-col items-center gap-1 ${
                formData.type === 'expense' 
                  ? 'bg-red-50 border-red-200 text-red-600 shadow-inner' 
                  : 'bg-white border-gray-200 text-gray-400 hover:bg-gray-50'
              }`}
            >
              <span className="text-sm">Pengeluaran</span>
            </button>
            <button
              type="button"
              onClick={() => setFormData({...formData, type: 'income'})}
              className={`p-4 rounded-2xl font-bold border transition-all duration-300 flex flex-col items-center gap-1 ${
                formData.type === 'income' 
                  ? 'bg-green-50 border-green-200 text-green-600 shadow-inner' 
                  : 'bg-white border-gray-200 text-gray-400 hover:bg-gray-50'
              }`}
            >
              <span className="text-sm">Pemasukan</span>
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button 
          disabled={loading} 
          className="w-full bg-gray-900 hover:bg-black text-white py-4 rounded-2xl font-bold shadow-lg flex justify-center gap-2 items-center transition-all hover:scale-[1.02] active:scale-[0.98] mt-6"
        >
          {loading ? 'Menyimpan...' : <><Save size={20} /> Simpan</>}
        </button>
      </form>
    </div>
  );
}