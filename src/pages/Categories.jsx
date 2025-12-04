import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/client';
import { Tag, Plus, Trash2, Edit2, ArrowUpCircle, ArrowDownCircle, Search } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { useConfirm } from '../context/ConfirmContext';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [filter, setFilter] = useState('');
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { showConfirm } = useConfirm();
  const [loading, setLoading] = useState(true);

  const fetchCategories = () => {
    setLoading(true);
    apiClient.get('/categories')
      .then(res => setCategories(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleDelete = (id) => {
    showConfirm(
      "Hapus Kategori?", 
      "Perhatian! Menghapus kategori dapat mempengaruhi riwayat transaksi Anda.", 
      async () => {
        try {
          await apiClient.delete(`/categories/${id}`);
          showToast('Kategori dihapus', 'success');
          fetchCategories();
        } catch (error) {
          showToast('Gagal menghapus kategori', 'error');
        }
      }
    );
  };

  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 pb-24 animate-fade-in">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Tag className="text-blue-600" /> Kelola Kategori
          </h1>
          <p className="text-xs text-gray-400 mt-1">Atur label untuk transaksimu</p>
        </div>
        <button 
          onClick={() => navigate('/categories/add')} 
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-2xl shadow-lg shadow-blue-200 flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 font-medium text-sm"
        >
          <Plus size={20} /> Tambah Kategori
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 mb-6 flex items-center">
        <Search className="text-gray-400 ml-3" size={20} />
        <input 
          type="text" 
          placeholder="Cari kategori..." 
          className="w-full p-3 bg-transparent outline-none text-sm font-medium"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      {/* List Categories */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="h-24 bg-white rounded-2xl animate-pulse border border-gray-100"></div>)}
        </div>
      ) : filteredCategories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCategories.map((cat, index) => (
            <div 
              key={cat.id} 
              style={{ animationDelay: `${index * 50}ms` }}
              className="bg-white p-5 rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100 flex justify-between items-center group hover:border-blue-200 hover:shadow-md transition-all duration-300 animate-slide-up"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${cat.type === 'income' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                  {cat.type === 'income' ? <ArrowUpCircle size={24} /> : <ArrowDownCircle size={24} />}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-base">{cat.name}</h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 inline-block uppercase tracking-wide ${cat.type === 'income' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {cat.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => navigate(`/categories/edit/${cat.id}`)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors">
                  <Edit2 size={18} />
                </button>
                <button onClick={() => handleDelete(cat.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-gray-400">
          <p>Tidak ada kategori ditemukan</p>
        </div>
      )}
    </div>
  );
}