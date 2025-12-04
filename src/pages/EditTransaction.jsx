import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import apiClient from '../api/client';
import { ArrowLeft, Save, AlignLeft } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export default function EditTransaction() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { showToast } = useToast();
  
  const [formData, setFormData] = useState({
    title: '', amount: '', type: 'expense', category_id: ''
  });

  useEffect(() => {
    const initData = async () => {
      try {
        const [catRes, trxRes] = await Promise.all([
          apiClient.get('/categories'),
          apiClient.get(`/transactions/${id}`)
        ]);
        setCategories(catRes.data);
        const trx = trxRes.data;
        setFormData({
          title: trx.title,
          amount: trx.amount,
          type: trx.type,
          category_id: trx.category_id
        });
      } catch (error) {
        showToast("Gagal memuat data", "error");
        navigate(-1);
      } finally {
        setIsLoading(false);
      }
    };
    initData();
  }, [id, navigate, showToast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.category_id) return showToast("Pilih kategori dulu!", "error");

    setIsLoading(true);
    try {
      await apiClient.put(`/transactions/${id}`, formData);
      showToast('Perubahan disimpan!', 'success');
      navigate(`/transaction/${id}`);
    } catch (error) {
      showToast('Gagal update', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCategories = categories.filter(c => c.type === formData.type);

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><div className="loader border-blue-600"></div></div>;

  return (
    <div className="max-h-screen bg-gray-50 p-6 animate-fade-in">
      <div className="max-w-xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate(-1)} className="p-3 bg-white rounded-xl shadow-sm hover:bg-gray-50 border border-gray-100 transition-colors"><ArrowLeft size={20} /></button>
          <h1 className="font-bold text-2xl text-gray-800">Edit Transaksi</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 space-y-6">
            {/* Tipe Switcher */}
            <div className="bg-gray-100 p-1.5 rounded-2xl flex relative">
              <div className={`absolute left-1.5 top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white rounded-xl shadow-sm transition-all duration-300 ${formData.type === 'income' ? 'translate-x-full' : ''}`}></div>
              <button type="button" onClick={() => setFormData({...formData, type: 'expense', category_id: ''})} className={`flex-1 py-3 text-sm font-bold z-10 relative transition-colors ${formData.type === 'expense' ? 'text-red-600' : 'text-gray-500'}`}>Pengeluaran</button>
              <button type="button" onClick={() => setFormData({...formData, type: 'income', category_id: ''})} className={`flex-1 py-3 text-sm font-bold z-10 relative transition-colors ${formData.type === 'income' ? 'text-green-600' : 'text-gray-500'}`}>Pemasukan</button>
            </div>

            {/* Nominal */}
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">Nominal (Rp)</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-lg">Rp</span>
                <input type="number" className="w-full pl-12 p-4 border-2 border-gray-100 rounded-2xl bg-gray-50 text-3xl font-bold text-gray-800 focus:bg-white focus:border-blue-500 focus:ring-0 transition-all outline-none" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} required />
              </div>
            </div>

            {/* Judul */}
            <div>
              <label className="block text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">Keterangan</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><AlignLeft size={20} className="text-gray-400" /></div>
                <input type="text" className="w-full pl-12 p-4 border border-gray-200 rounded-2xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none font-medium" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
              </div>
            </div>
          </div>

          {/* Kategori Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {filteredCategories.map(cat => (
              <div key={cat.id} onClick={() => setFormData({...formData, category_id: cat.id})} className={`cursor-pointer p-4 rounded-2xl border transition-all duration-200 flex flex-col items-center text-center gap-2 ${formData.category_id === cat.id ? 'bg-gray-900 border-gray-900 text-white shadow-lg scale-105' : 'bg-white border-gray-200 text-gray-600 hover:border-blue-300'}`}>
                <span className="font-semibold text-sm truncate w-full">{cat.name}</span>
              </div>
            ))}
          </div>

          <button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold shadow-xl shadow-blue-200 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]">
            {isLoading ? 'Menyimpan...' : <><Save size={20} /> Simpan Perubahan</>}
          </button>

        </form>
      </div>
    </div>
  );
}