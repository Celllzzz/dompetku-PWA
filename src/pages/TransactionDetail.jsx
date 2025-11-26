import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../api/client';
import { ArrowLeft, Trash2, Edit2 } from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { useConfirm } from '../context/ConfirmContext';


export default function TransactionDetail() {
  const { id } = useParams(); // Ambil ID dari URL
  const navigate = useNavigate();
  const [trx, setTrx] = useState(null);
  const { showToast } = useToast();
  const { showConfirm } = useConfirm();

  useEffect(() => {
    apiClient.get(`/transactions/${id}`)
      .then(res => setTrx(res.data))
      .catch(err => console.error(err));
  }, [id]);

  const handleDeleteClick = () => {
    showConfirm(
      "Hapus Transaksi?", // Judul
      "Data yang dihapus tidak dapat dikembalikan. Apakah Anda yakin?", // Pesan
      async () => { 
        // Callback: Fungsi ini jalan CUMA kalau user klik "Ya"
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

  if (!trx) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white p-4 flex items-center gap-4 shadow-sm">
        <button onClick={() => navigate(-1)}><ArrowLeft /></button>
        <h1 className="font-bold text-lg">Detail Transaksi</h1>
      </div>

      <div className="p-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm text-center mb-6">
           <p className="text-gray-500 text-sm mb-1">Nominal</p>
           <h2 className={`text-3xl font-bold ${trx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
             Rp {Number(trx.amount).toLocaleString()}
           </h2>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b">
            <p className="text-xs text-gray-500">Judul</p>
            <p className="font-medium">{trx.title}</p>
          </div>
          <div className="p-4 border-b">
            <p className="text-xs text-gray-500">Kategori</p>
            <p className="font-medium">{trx.categories?.name}</p>
          </div>
          <div className="p-4 border-b">
            <p className="text-xs text-gray-500">Tanggal</p>
            <p className="font-medium">{trx.date}</p>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
        <button 
          onClick={() => navigate(`/transaction/edit/${id}`)} // Link ke Edit
          className="flex-1 flex items-center justify-center gap-2 bg-blue-50 text-blue-600 py-3 rounded-xl font-bold"
        >
          <Edit2 size={20} /> Edit
        </button>
        <button 
          onClick={handleDeleteClick} // Panggil fungsi wrapper tadi
          className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-600 py-3 rounded-xl font-bold hover:bg-red-100 transition-colors"
        >
          <Trash2 size={20} /> Hapus
        </button>
      </div>
    </div>
    </div>
  );
}