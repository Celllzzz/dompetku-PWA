import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/client';
import { Wallet, TrendingUp, TrendingDown, Search, Filter, X, ChevronRight } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const [allTransactions, setAllTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [loading, setLoading] = useState(true);
  const [financials, setFinancials] = useState({ saldo: 0, income: 0, expense: 0 });

  const formatRupiah = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trxRes, catRes] = await Promise.all([
          apiClient.get('/transactions'),
          apiClient.get('/categories')
        ]);
        
        const sortedData = trxRes.data.sort((a, b) => new Date(b.date) - new Date(a.date));
        setAllTransactions(sortedData);
        setFilteredTransactions(sortedData);
        setCategories(catRes.data);
        calculateFinancials(sortedData);
      } catch (err) { console.error(err); } 
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const calculateFinancials = (data) => {
    let inc = 0, exp = 0;
    data.forEach(trx => trx.type === 'income' ? inc += Number(trx.amount) : exp += Number(trx.amount));
    setFinancials({ saldo: inc - exp, income: inc, expense: exp });
  };

  useEffect(() => {
    let result = allTransactions;
    if (searchTerm) result = result.filter(t => t.title.toLowerCase().includes(searchTerm.toLowerCase()));
    if (filterCategory) result = result.filter(t => t.category_id === filterCategory);
    setFilteredTransactions(result);
  }, [searchTerm, filterCategory, allTransactions]);

  return (
    <div className="p-6 space-y-8 animate-fade-in">
      
      {/* Header Saldo Modern */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-blue-200 hover:shadow-blue-300 transition-shadow duration-500">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-48 h-48 bg-blue-400 opacity-10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3 opacity-90">
            <div className="p-2 bg-white/10 rounded-full backdrop-blur-md">
              <Wallet size={18} /> 
            </div>
            <span className="text-sm font-medium tracking-wide">Total Saldo</span>
          </div>
          <h2 className="text-5xl font-bold tracking-tight mb-8 drop-shadow-sm">{formatRupiah(financials.saldo)}</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/10 hover:bg-white/15 transition-colors">
              <div className="flex items-center gap-3 mb-1">
                <div className="bg-green-400/20 p-1.5 rounded-lg text-green-300"><TrendingUp size={16} /></div>
                <p className="text-xs opacity-80 font-medium">Pemasukan</p>
              </div>
              <p className="font-bold text-lg">{formatRupiah(financials.income)}</p>
            </div>
            <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/10 hover:bg-white/15 transition-colors">
              <div className="flex items-center gap-3 mb-1">
                <div className="bg-red-400/20 p-1.5 rounded-lg text-red-300"><TrendingDown size={16} /></div>
                <p className="text-xs opacity-80 font-medium">Pengeluaran</p>
              </div>
              <p className="font-bold text-lg">{formatRupiah(financials.expense)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="sticky top-0 bg-gray-50 pt-2 pb-2 z-10">
        <div className="flex gap-3">
          <div className="flex-1 bg-white group focus-within:ring-2 focus-within:ring-blue-500/20 flex items-center px-4 py-3.5 rounded-2xl border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-md hover:border-blue-100">
            <Search size={20} className="text-gray-400 mr-3 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Cari transaksi..." 
              className="bg-transparent outline-none text-sm w-full font-medium placeholder:font-normal"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && <button onClick={() => setSearchTerm('')}><X size={18} className="text-gray-400 hover:text-gray-600 transition-colors"/></button>}
          </div>
          <button 
            onClick={() => setShowFilter(!showFilter)}
            className={`p-3.5 rounded-2xl border shadow-sm transition-all duration-300 hover:scale-105 active:scale-95 ${showFilter ? 'bg-blue-600 text-white border-blue-600 shadow-blue-200' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}
          >
            <Filter size={20} />
          </button>
        </div>

        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showFilter ? 'max-h-20 opacity-100 mt-3' : 'max-h-0 opacity-0'}`}>
          <select 
            className="w-full p-3.5 bg-white border border-gray-200 rounded-2xl text-sm font-medium focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-sm appearance-none"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="">Semua Kategori</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* List Transaksi */}
      <div className="space-y-4">
        <h3 className="font-bold text-gray-800 text-lg px-1 flex items-center gap-2">
           {searchTerm || filterCategory ? 'Hasil Pencarian' : 'Transaksi Terakhir'}
        </h3>

        {loading ? (
           <div className="space-y-4">
             {[1,2,3].map(i => <div key={i} className="h-24 bg-white rounded-2xl animate-pulse shadow-sm border border-gray-100"></div>)}
           </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border-2 border-dashed border-gray-200">
            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={24} className="text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">Tidak ada transaksi ditemukan</p>
          </div>
        ) : (
          filteredTransactions.map((trx, index) => (
            <div 
              key={trx.id} 
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => navigate(`/transaction/${trx.id}`)}
              className="group bg-white p-5 rounded-3xl shadow-[0_2px_15px_rgba(0,0,0,0.03)] border border-gray-100 flex justify-between items-center cursor-pointer hover:border-blue-200 hover:shadow-[0_8px_25px_rgba(37,99,235,0.1)] transition-all duration-300 active:scale-[0.98] animate-slide-up"
            >
              <div className="flex items-center gap-5">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-sm transition-transform group-hover:scale-110 duration-300 ${
                  trx.type === 'income' ? 'bg-green-50 text-green-600 ring-1 ring-green-100' : 'bg-red-50 text-red-600 ring-1 ring-red-100'
                }`}>
                  {trx.categories?.name ? trx.categories.name.charAt(0).toUpperCase() : '?'}
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-base mb-1 group-hover:text-blue-600 transition-colors">{trx.title}</h4>
                  <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
                    <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-500">{trx.categories?.name}</span>
                    <span>•</span>
                    <span>{new Date(trx.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long' })}</span>
                  </div>
                </div>
              </div>
              <div className="text-right flex items-center gap-3">
                <span className={`block font-bold text-sm md:text-base ${trx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                  {trx.type === 'income' ? '+' : '-'} {formatRupiah(trx.amount)}
                </span>
                <ChevronRight size={18} className="text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}