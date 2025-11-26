import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import apiClient from '../api/client';
import { ArrowLeft, Save } from 'lucide-react';

export default function EditTransaction() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    title: '', amount: '', type: 'expense', category_id: ''
  });

  // Fetch Kategori & Data Transaksi Lama
  useEffect(() => {
    const initData = async () => {
      try {
        const [catRes, trxRes] = await Promise.all([
          apiClient.get('/categories'),
          apiClient.get(`/transactions/${id}`)
        ]);
        setCategories(catRes.data);
        
        // Sesuaikan mapping data dengan response API Anda
        const trx = trxRes.data; 
        setFormData({
          title: trx.title,
          amount: trx.amount,
          type: trx.type,
          category_id: trx.category_id
        });
      } catch (error) {
        alert("Gagal memuat data");
        navigate(-1);
      } finally {
        setLoading(false);
      }
    };
    initData();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiClient.put(`/transactions/${id}`, formData);
      alert('Berhasil diperbarui!');
      navigate(`/transaction/${id}`); // Balik ke detail
    } catch (error) {
      console.error(error);
      alert('Gagal update.');
    }
  };

  if (loading) return <div className="p-8 text-center">Loading data...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-white p-4 flex items-center gap-4 shadow-sm">
        <button onClick={() => navigate(-1)}><ArrowLeft /></button>
        <h1 className="font-bold text-lg">Edit Transaksi</h1>
      </div>

      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
           {/* Form input sama persis dengan AddTransaction, 
               hanya value-nya ambil dari state formData yang sudah terisi */}
           <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Judul</label>
            <input 
              type="text" 
              className="w-full p-3 border rounded-xl bg-white"
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})} required 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nominal</label>
            <input 
              type="number" 
              className="w-full p-3 border rounded-xl bg-white"
              value={formData.amount}
              onChange={e => setFormData({...formData, amount: e.target.value})} required 
            />
          </div>

          <div>
             <label className="block text-sm font-medium mb-2">Tipe</label>
             {/* Gunakan logika tombol tipe yang sama seperti AddTransaction */}
             <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={() => setFormData({...formData, type: 'expense'})}
                className={`p-3 rounded-xl border ${formData.type === 'expense' ? 'bg-red-50 border-red-500 text-red-600' : 'bg-white'}`}>
                Pengeluaran
              </button>
              <button type="button" onClick={() => setFormData({...formData, type: 'income'})}
                className={`p-3 rounded-xl border ${formData.type === 'income' ? 'bg-green-50 border-green-500 text-green-600' : 'bg-white'}`}>
                Pemasukan
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Kategori</label>
            <select 
              className="w-full p-3 border rounded-xl bg-white"
              value={formData.category_id}
              onChange={e => setFormData({...formData, category_id: e.target.value})} required
            >
              <option value="">-- Pilih --</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold flex justify-center gap-2">
            <Save size={20} /> Simpan Perubahan
          </button>
        </form>
      </div>
    </div>
  );
}