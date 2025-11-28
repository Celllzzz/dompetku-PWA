import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../api/client';
import { ArrowLeft, Trash2, Edit2, Calendar, Tag, AlignLeft, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { useConfirm } from '../context/ConfirmContext';

export default function TransactionDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trx, setTrx] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  const { showConfirm } = useConfirm();

  // Helper Format Rupiah
  const formatRupiah = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

  useEffect(() => {
    apiClient.get(`/transactions/${id}`)
      .then(res => setTrx(res.data))
      .catch(err => {
        console.error(err);
        showToast("Gagal memuat data", "error");
        navigate(-1);
      })
      .finally(() => setLoading(false));
  }, [id, navigate, showToast]);

  const handleDeleteClick = () => {
    showConfirm(
      "Hapus Transaksi?",
      "Data yang dihapus tidak dapat dikembalikan. Lanjutkan?",
      async () => {
        try {
          await apiClient.delete(`/transactions/${id}`);
          showToast('Transaksi berhasil dihapus', 'success');
          navigate('/');
        } catch (error) {
          showToast('Gagal menghapus data', 'error');
        }
      }
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!trx) return null;

  return (
    <div className="min-h-screen bg-gray-50 p-6 pb-32 animate-fade-in">
      <div className="max-w-xl mx-auto">
        
        {/* Header Navigation */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate(-1)} className="p-3 bg-white rounded-xl shadow-sm hover:bg-gray-50 border border-gray-100 transition-colors">
            <ArrowLeft size={20} />
          </button>
          <h1 className="font-bold text-2xl text-gray-800">Detail Transaksi</h1>
        </div>

        <div className="space-y-6">
          
          {/* Main Card (Nominal) */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-blue-50 border border-white relative overflow-hidden text-center">
            {/* Garis Indikator di Atas */}
            <div className={`absolute top-0 left-0 w-full h-2 ${trx.type === 'income' ? 'bg-green-500' : 'bg-red-500'}`}></div>
            
            <div className={`w-20 h-20 mx-auto rounded-3xl flex items-center justify-center mb-4 shadow-sm transition-transform hover:scale-110 ${
              trx.type === 'income' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
            }`}>
              {trx.type === 'income' ? <ArrowUpCircle size={40} /> : <ArrowDownCircle size={40} />}
            </div>

            <p className="text-gray-400 text-sm font-bold tracking-wide uppercase mb-2">
              {trx.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}
            </p>
            
            <h2 className={`text-4xl font-bold mb-1 tracking-tight ${trx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
              {formatRupiah(trx.amount)}
            </h2>
          </div>

          {/* Details Info */}
          <div className="bg-white p-6 rounded-[2rem] shadow-lg shadow-gray-100 border border-gray-100 space-y-4">
            
            <div className="flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-50 transition-colors">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <AlignLeft size={22} />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Keterangan</p>
                <p className="font-bold text-gray-800 text-lg">{trx.title}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-50 transition-colors">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                <Tag size={22} />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Kategori</p>
                <p className="font-bold text-gray-800 text-lg">{trx.categories?.name || 'Tanpa Kategori'}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-50 transition-colors">
              <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
                <Calendar size={22} />
              </div>
              <div>
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Tanggal</p>
                <p className="font-bold text-gray-800 text-lg">
                  {new Date(trx.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>

          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <button 
              onClick={() => navigate(`/transaction/edit/${id}`)} 
              className="flex items-center justify-center gap-2 py-4 rounded-2xl font-bold bg-blue-50 text-blue-600 hover:bg-blue-100 hover:shadow-lg hover:shadow-blue-100 transition-all active:scale-95 border border-blue-100"
            >
              <Edit2 size={20} /> Edit
            </button>
            <button 
              onClick={handleDeleteClick} 
              className="flex items-center justify-center gap-2 py-4 rounded-2xl font-bold bg-red-50 text-red-600 hover:bg-red-100 hover:shadow-lg hover:shadow-red-100 transition-all active:scale-95 border border-red-100"
            >
              <Trash2 size={20} /> Hapus
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}