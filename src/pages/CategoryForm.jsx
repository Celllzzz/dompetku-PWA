import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import apiClient from '../api/client';
import { ArrowLeft, Save, Type, Layers } from 'lucide-react';
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
        .catch(err => showToast("Gagal memuat data", "error"));
    }
  }, [id]);

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
    <div className="p-6 space-y-6 animate-fade-in bg-gray-50">
      <div className="max-w-xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate(-1)} className="p-3 bg-white rounded-xl shadow-sm hover:bg-gray-50 border border-gray-100 transition-colors"><ArrowLeft size={20} /></button>
          <h1 className="font-bold text-2xl text-gray-800">{id ? 'Edit Kategori' : 'Kategori Baru'}</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-[2rem] shadow-lg shadow-gray-100 border border-gray-100">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Nama Kategori</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Type size={18} className="text-gray-400" />
              </div>
              <input 
                type="text" 
                placeholder="Contoh: Belanja, Gaji, Kost"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full pl-11 p-4 border border-gray-200 rounded-2xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none font-medium" required 
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Jenis Transaksi</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setFormData({...formData, type: 'expense'})}
                className={`p-4 rounded-2xl font-bold border transition-all duration-300 flex flex-col items-center gap-2 ${
                  formData.type === 'expense' 
                    ? 'bg-red-50 border-red-200 text-red-600 shadow-md shadow-red-100 scale-[1.02]' 
                    : 'bg-white border-gray-200 text-gray-400 hover:bg-gray-50'
                }`}
              >
                <span className="text-sm">Pengeluaran</span>
              </button>
              <button
                type="button"
                onClick={() => setFormData({...formData, type: 'income'})}
                className={`p-4 rounded-2xl font-bold border transition-all duration-300 flex flex-col items-center gap-2 ${
                  formData.type === 'income' 
                    ? 'bg-green-50 border-green-200 text-green-600 shadow-md shadow-green-100 scale-[1.02]' 
                    : 'bg-white border-gray-200 text-gray-400 hover:bg-gray-50'
                }`}
              >
                <span className="text-sm">Pemasukan</span>
              </button>
            </div>
          </div>

          <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold shadow-xl shadow-blue-200 flex justify-center gap-2 items-center transition-all hover:scale-[1.02] active:scale-[0.98] mt-4">
            {loading ? 'Menyimpan...' : <><Save size={20} /> Simpan Kategori</>}
          </button>
        </form>
      </div>
    </div>
  );
}