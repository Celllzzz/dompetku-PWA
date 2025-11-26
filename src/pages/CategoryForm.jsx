import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import apiClient from '../api/client';
import { ArrowLeft, Save } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function CategoryForm() {
  const { id } = useParams(); // Jika ada ID, berarti mode Edit
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', type: 'expense' });
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (id) {
      apiClient.get(`/categories/${id}`)
        .then(res => setFormData(res.data)) // Supabase mungkin mengembalikan array/object, sesuaikan
        .catch(err => alert("Gagal ambil data"));
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (id) {
        await apiClient.put(`/categories/${id}`, formData);
        showToast('Kategori berhasil diperbarui', 'success');
      } else {
        await apiClient.post('/categories', formData);
        showToast('Kategori baru ditambahkan', 'success');
      }
      navigate('/categories');
    } catch (error) {
      showToast('Terjadi kesalahan sistem', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(-1)}><ArrowLeft /></button>
        <h1 className="font-bold text-lg">{id ? 'Edit Kategori' : 'Tambah Kategori'}</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-2xl shadow-sm">
        <div>
          <label className="block text-sm font-medium mb-1">Nama Kategori</label>
          <input 
            type="text" 
            value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})}
            className="w-full p-3 border rounded-xl" required 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Tipe</label>
          <select 
            value={formData.type}
            onChange={e => setFormData({...formData, type: e.target.value})}
            className="w-full p-3 border rounded-xl"
          >
            <option value="expense">Pengeluaran</option>
            <option value="income">Pemasukan</option>
          </select>
        </div>
        <button disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold flex justify-center gap-2">
          <Save size={20} /> {loading ? 'Menyimpan...' : 'Simpan'}
        </button>
      </form>
    </div>
  );
}