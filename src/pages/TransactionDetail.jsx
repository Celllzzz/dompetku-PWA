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

  const formatRupiah = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

  useEffect(() => {
    apiClient.get(`/transactions/${id}`)
      .then(res => setTrx(res.data))
      .catch(err => { showToast("Gagal memuat data", "error"); navigate(-1); })
      .finally(() => setLoading(false));
  }, [id, navigate, showToast]);

  const handleDeleteClick = () => {
    showConfirm("Hapus Transaksi?", "Data akan hilang permanen.", async () => {
      try {
        await apiClient.delete(`/transactions/${id}`);
        showToast('Transaksi dihapus', 'success');
        navigate('/');
      } catch (error) {
        showToast('Gagal menghapus', 'error');
      }
    });
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="loader border-blue-600"></div></div>;
  if (!trx) return null;

  return (
    <div className="max-h-screen bg-gray-50 p-6 animate-fade-in flex flex-col justify-center max-w-xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate(-1)} className="p-3 bg-white rounded-xl shadow-sm hover:bg-gray-100 border border-gray-100"><ArrowLeft size={20} /></button>
        <h1 className="font-bold text-2xl text-gray-800">Detail</h1>
      </div>

      <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-100 border border-white text-center relative overflow-hidden">
        <div className={`absolute top-0 left-0 w-full h-3 ${trx.type === 'income' ? 'bg-green-500' : 'bg-red-500'}`}></div>
        
        <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6 shadow-sm ${trx.type === 'income' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
          {trx.type === 'income' ? <ArrowUpCircle size={48} /> : <ArrowDownCircle size={48} />}
        </div>

        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-2">{trx.type === 'income' ? 'PEMASUKAN' : 'PENGELUARAN'}</p>
        <h2 className={`text-4xl font-extrabold mb-8 tracking-tight ${trx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
          {formatRupiah(trx.amount)}
        </h2>

        <div className="space-y-4 text-left">
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
            <div className="p-2.5 bg-white text-blue-600 rounded-xl shadow-sm"><AlignLeft size={20} /></div>
            <div><p className="text-[10px] text-gray-400 font-bold uppercase">Keterangan</p><p className="font-bold text-gray-800">{trx.title}</p></div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
            <div className="p-2.5 bg-white text-purple-600 rounded-xl shadow-sm"><Tag size={20} /></div>
            <div><p className="text-[10px] text-gray-400 font-bold uppercase">Kategori</p><p className="font-bold text-gray-800">{trx.categories?.name}</p></div>
          </div>
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
            <div className="p-2.5 bg-white text-orange-600 rounded-xl shadow-sm"><Calendar size={20} /></div>
            <div><p className="text-[10px] text-gray-400 font-bold uppercase">Waktu</p><p className="font-bold text-gray-800">{new Date(trx.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p></div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-8">
          <button onClick={() => navigate(`/transaction/edit/${id}`)} className="flex items-center justify-center gap-2 py-4 rounded-2xl font-bold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
            <Edit2 size={18} /> Edit
          </button>
          <button onClick={handleDeleteClick} className="flex items-center justify-center gap-2 py-4 rounded-2xl font-bold bg-red-50 text-red-600 hover:bg-red-100 transition-colors">
            <Trash2 size={18} /> Hapus
          </button>
        </div>
      </div>
    </div>
  );
}