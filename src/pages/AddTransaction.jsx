import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/client';
import { ArrowLeft, Save, AlignLeft, Hash } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function AddTransaction() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();
  
  const [formData, setFormData] = useState({
    title: '', amount: '', type: 'expense', category_id: ''
  });

  useEffect(() => {
    apiClient.get('/categories').then(res => setCategories(res.data)).catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.category_id) return showToast("Pilih kategori dulu!", "error");
    
    setIsLoading(true);
    try {
      await apiClient.post('/transactions', formData);
      showToast('Transaksi disimpan!', 'success'); 
      navigate('/');
    } catch (error) {
      showToast('Gagal menyimpan', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCategories = categories.filter(c => c.type === formData.type);

  return (
    <div className="p-6 space-y-6 animate-fade-in bg-gray-50">
      <div className="max-w-xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate(-1)} className="p-3 bg-white rounded-xl shadow-sm hover:bg-gray-50 border border-gray-100 transition-colors"><ArrowLeft size={20} /></button>
          <h1 className="font-bold text-2xl text-gray-800">Catat Transaksi</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Card Input Utama */}
          <div className="bg-white p-6 rounded-[2rem] shadow-lg shadow-gray-100 border border-gray-100 space-y-6">
            {/* Tipe Switcher */}
            <div className="bg-gray-100 p-1.5 rounded-2xl flex relative">
              <div className={`absolute left-1.5 top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white rounded-xl shadow-sm transition-all duration-300 ${formData.type === 'income' ? 'translate-x-full' : ''}`}></div>
              <button type="button" onClick={() => setFormData({...formData, type: 'expense', category_id: ''})} className={`flex-1 py-3 text-sm font-bold z-10 relative transition-colors ${formData.type === 'expense' ? 'text-red-600' : 'text-gray-500'}`}>Pengeluaran</button>
              <button type="button" onClick={() => setFormData({...formData, type: 'income', category_id: ''})} className={`flex-1 py-3 text-sm font-bold z-10 relative transition-colors ${formData.type === 'income' ? 'text-green-600' : 'text-gray-500'}`}>Pemasukan</button>
            </div>

            {/* Nominal Besar */}
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">Nominal (Rp)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-lg">Rp</span>
                <input 
                  type="number" 
                  placeholder="0"
                  className="w-full pl-12 p-4 border-2 border-gray-100 rounded-2xl bg-gray-50 text-2xl font-bold text-gray-800 focus:bg-white focus:border-blue-500 focus:ring-0 transition-all outline-none placeholder:text-gray-300"
                  value={formData.amount}
                  onChange={e => setFormData({...formData, amount: e.target.value})} 
                  required 
                />
              </div>
            </div>

            {/* Judul */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 ml-1">Keterangan</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <AlignLeft size={18} className="text-gray-400" />
                </div>
                <input 
                  type="text" 
                  placeholder="Contoh: Makan Siang"
                  className="w-full pl-11 p-4 border border-gray-200 rounded-2xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none font-medium"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})} 
                  required 
                />
              </div>
            </div>
          </div>

          {/* Pilihan Kategori Grid */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3 ml-1">Pilih Kategori</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {filteredCategories.map(cat => (
                <div 
                  key={cat.id}
                  onClick={() => setFormData({...formData, category_id: cat.id})}
                  className={`cursor-pointer p-4 rounded-2xl border transition-all duration-200 flex flex-col items-center text-center gap-2 ${
                    formData.category_id === cat.id 
                      ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200 scale-105' 
                      : 'bg-white border-gray-200 text-gray-600 hover:border-blue-300 hover:bg-blue-50'
                  }`}
                >
                  <span className="font-semibold text-sm truncate w-full">{cat.name}</span>
                </div>
              ))}
              {filteredCategories.length === 0 && (
                <div className="col-span-full text-center py-8 text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-2xl">
                  Belum ada kategori {formData.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}
                </div>
              )}
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-gray-900 hover:bg-black text-white py-4 rounded-2xl font-bold shadow-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            {isLoading ? 'Menyimpan...' : <><Save size={20} /> Simpan Transaksi</>}
          </button>

        </form>
      </div>
    </div>
  );
}