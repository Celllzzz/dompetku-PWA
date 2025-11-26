import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/client';
import { Wallet, TrendingUp, TrendingDown, ChevronRight, Search, Filter, X } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  // State Data Utama
  const [allTransactions, setAllTransactions] = useState([]); // Data Asli
  const [categories, setCategories] = useState([]); // Data Kategori untuk Filter
  
  // State Filter
  const [filteredTransactions, setFilteredTransactions] = useState([]); // Data Tampil
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [showFilter, setShowFilter] = useState(false); // Toggle menu filter

  const [loading, setLoading] = useState(true);
  
  // State Saldo (Dihitung dari filtered atau all? Biasanya dari All)
  const [financials, setFinancials] = useState({ saldo: 0, income: 0, expense: 0 });

  // Helper Format
  const formatRupiah = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

  // 1. Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trxRes, catRes] = await Promise.all([
          apiClient.get('/transactions'),
          apiClient.get('/categories')
        ]);
        
        const sortedData = trxRes.data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setAllTransactions(sortedData);
        setFilteredTransactions(sortedData); // Awalnya tampil semua
        setCategories(catRes.data);

        calculateFinancials(sortedData);
      } catch (err) { console.error(err); } 
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  // 2. Logic Hitung Saldo
  const calculateFinancials = (data) => {
    let inc = 0, exp = 0;
    data.forEach(trx => trx.type === 'income' ? inc += Number(trx.amount) : exp += Number(trx.amount));
    setFinancials({ saldo: inc - exp, income: inc, expense: exp });
  };

  // 3. Logic Filter Real-time
  useEffect(() => {
    let result = allTransactions;

    // Filter by Search Title
    if (searchTerm) {
      result = result.filter(t => t.title.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    // Filter by Category
    if (filterCategory) {
      result = result.filter(t => t.category_id === filterCategory);
    }

    setFilteredTransactions(result);
  }, [searchTerm, filterCategory, allTransactions]);


  return (
    <div className="p-6 space-y-6 pb-24 animate-fade-in">
      
      {/* Header Saldo (Tetap menghitung Total Asli, bukan hasil filter) */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 text-white shadow-xl shadow-blue-200">
        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2 opacity-80">
            <Wallet size={18} /> <span>Total Saldo</span>
          </div>
          <h2 className="text-4xl font-bold tracking-tight mb-6">{formatRupiah(financials.saldo)}</h2>
          <div className="grid grid-cols-2 gap-4 bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10">
             {/* ... (Income/Expense Display sama seperti sebelumnya) ... */}
             <div className="flex items-center gap-3">
              <div className="bg-green-400/20 p-2 rounded-lg text-green-300"><TrendingUp size={20} /></div>
              <div><p className="text-xs opacity-70">Pemasukan</p><p className="font-semibold text-sm">{formatRupiah(financials.income)}</p></div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-red-400/20 p-2 rounded-lg text-red-300"><TrendingDown size={20} /></div>
              <div><p className="text-xs opacity-70">Pengeluaran</p><p className="font-semibold text-sm">{formatRupiah(financials.expense)}</p></div>
            </div>
          </div>
        </div>
      </div>

      {/* SEARCH & FILTER SECTION */}
      <div className="sticky top-0 bg-gray-50 pt-2 pb-2 z-10">
        <div className="flex gap-2">
          <div className="flex-1 bg-white flex items-center px-4 py-3 rounded-xl border border-gray-200 shadow-sm focus-within:border-blue-500 transition-colors">
            <Search size={18} className="text-gray-400 mr-2" />
            <input 
              type="text" 
              placeholder="Cari transaksi..." 
              className="bg-transparent outline-none text-sm w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && <button onClick={() => setSearchTerm('')}><X size={16} className="text-gray-400"/></button>}
          </div>
          <button 
            onClick={() => setShowFilter(!showFilter)}
            className={`p-3 rounded-xl border shadow-sm transition-colors ${showFilter ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-500 border-gray-200'}`}
          >
            <Filter size={20} />
          </button>
        </div>

        {/* Dropdown Filter Kategori (Muncul jika tombol filter diklik) */}
        {showFilter && (
          <div className="mt-3 animate-slide-down">
            <select 
              className="w-full p-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="">Semua Kategori</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* LIST TRANSAKSI */}
      <div className="space-y-3">
        <h3 className="font-bold text-gray-800">
           {searchTerm || filterCategory ? 'Hasil Pencarian' : 'Transaksi Terakhir'}
        </h3>

        {loading ? (
           <p className="text-center text-gray-400 text-sm">Loading...</p>
        ) : filteredTransactions.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-gray-300">
            <p className="text-gray-400">Tidak ada transaksi ditemukan</p>
          </div>
        ) : (
          filteredTransactions.map((trx) => (
            <div 
              key={trx.id} 
              onClick={() => navigate(`/transaction/${trx.id}`)}
              className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center cursor-pointer hover:border-blue-200 transition-all active:scale-95"
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold shadow-sm ${
                  trx.type === 'income' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                }`}>
                  {trx.categories?.name ? trx.categories.name.charAt(0) : '?'}
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">{trx.title}</h4>
                  <p className="text-xs text-gray-400">
                    {trx.categories?.name} • {new Date(trx.date).toLocaleDateString('id-ID')}
                  </p>
                </div>
              </div>
              <span className={`font-bold text-sm ${trx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                {trx.type === 'income' ? '+' : '-'} {formatRupiah(trx.amount)}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}