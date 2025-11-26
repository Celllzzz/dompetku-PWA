import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/client';
import { Tag, Plus, Trash2, Edit2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { useConfirm } from '../context/ConfirmContext';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { showConfirm } = useConfirm();

  const fetchCategories = () => {
    apiClient.get('/categories')
      .then(res => setCategories(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleDelete = (id) => {
    showConfirm(
      "Hapus Kategori?",
      "Perhatian! Menghapus kategori mungkin menyebabkan transaksi terkait kehilangan labelnya.",
      async () => {
        try {
          await apiClient.delete(`/categories/${id}`);
          showToast('Kategori dihapus', 'success');
          fetchCategories(); // Refresh list
        } catch (error) {
          showToast('Gagal menghapus kategori', 'error');
        }
      }
    );
  };

  return (
    <div className="p-4 pb-24 min-h-screen bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Kategori</h2>
        <button onClick={() => navigate('/categories/add')} className="bg-blue-600 text-white p-2 rounded-full shadow-lg">
          <Plus size={20} />
        </button>
      </div>

      <div className="grid gap-3">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white p-4 rounded-xl shadow-sm border flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-full ${cat.type === 'income' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                <Tag size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-700">{cat.name}</h3>
                <span className="text-xs text-gray-400 capitalize">{cat.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => navigate(`/categories/edit/${cat.id}`)} className="p-2 text-gray-400 hover:text-blue-600 bg-gray-50 rounded-lg">
                <Edit2 size={16} />
              </button>
              <button onClick={() => handleDelete(cat.id)} className="p-2 text-gray-400 hover:text-red-600 bg-gray-50 rounded-lg">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}