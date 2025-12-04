import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/client';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Calendar, Filter, PieChart as PieIcon, ArrowRightLeft, ChevronRight } from 'lucide-react';

export default function HistoryPage() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const currentMonth = new Date().toISOString().slice(0, 7);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [chartType, setChartType] = useState('expense'); // 'expense' | 'income'

  // Palet Warna Modern
  const COLORS = ['#6366F1', '#EC4899', '#10B981', '#F59E0B', '#8B5CF6', '#3B82F6', '#EF4444', '#14B8A6'];

  const formatRupiah = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await apiClient.get('/transactions');
        setTransactions(res.data);
      } catch (error) {
        console.error("Gagal ambil data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- LOGIC DATA ---
  const monthlyTransactions = transactions.filter(t => t.date.startsWith(selectedMonth));

  const summary = monthlyTransactions.reduce((acc, curr) => {
    const amount = Number(curr.amount);
    if (curr.type === 'income') acc.income += amount;
    else acc.expense += amount;
    return acc;
  }, { income: 0, expense: 0 });

  const typeTransactions = monthlyTransactions
    .filter(t => t.type === chartType)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const chartDataRaw = typeTransactions.reduce((acc, curr) => {
    const catName = curr.categories?.name || 'Lainnya';
    const amount = Number(curr.amount);
    if (!acc[catName]) acc[catName] = 0;
    acc[catName] += amount;
    return acc;
  }, {});

  const chartData = Object.keys(chartDataRaw).map(name => ({
    name,
    value: chartDataRaw[name]
  })).sort((a, b) => b.value - a.value);

  const totalChartValue = chartType === 'expense' ? summary.expense : summary.income;

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-xl shadow-xl border border-gray-100 z-50 relative">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: payload[0].payload.fill }}></div>
            <p className="text-xs text-gray-500 font-medium">{payload[0].name}</p>
          </div>
          <p className="text-sm font-bold text-gray-800">{formatRupiah(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 animate-fade-in">
      
      {/* === HEADER CARD === */}
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 mb-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <PieIcon className="text-blue-600" size={24} />
              History
            </h1>
            <p className="text-xs text-gray-400 mt-1">Analisis pengeluaranmu</p>
          </div>
          
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-blue-600">
              <Calendar size={16} />
            </div>
            <input 
              type="month" 
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="pl-9 pr-3 py-2 bg-blue-50 border border-blue-100 text-blue-700 rounded-xl text-xs font-bold shadow-sm outline-none focus:ring-2 focus:ring-blue-200 cursor-pointer"
            />
          </div>
        </div>

        {/* Toggle Switcher */}
        <div className="bg-gray-100 p-1.5 rounded-xl flex relative">
          <div className={`absolute left-1.5 top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white rounded-lg shadow-sm transition-all duration-300 ease-out ${chartType === 'income' ? 'translate-x-full' : ''}`}></div>
          <button 
            onClick={() => setChartType('expense')} 
            className={`flex-1 py-2.5 text-xs font-bold z-10 relative transition-colors ${chartType === 'expense' ? 'text-red-600' : 'text-gray-500'}`}
          >
            Pengeluaran
          </button>
          <button 
            onClick={() => setChartType('income')} 
            className={`flex-1 py-2.5 text-xs font-bold z-10 relative transition-colors ${chartType === 'income' ? 'text-green-600' : 'text-gray-500'}`}
          >
            Pemasukan
          </button>
        </div>
      </div>

      <div className="space-y-6">
        
        {/* === CHART SECTION (NEW STYLE) === */}
        {loading ? (
          <div className="h-64 bg-white rounded-[2rem] animate-pulse border border-gray-100"></div>
        ) : chartData.length > 0 ? (
          <div className="bg-white p-6 rounded-[2rem] shadow-lg shadow-blue-50 border border-white relative overflow-hidden">
            
            {/* 1. HEADLINE TOTAL (Di Atas) */}
            <div className="text-center mb-2">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                Total {chartType === 'income' ? 'Pemasukan' : 'Pengeluaran'}
              </p>
              <h2 className={`text-3xl md:text-4xl font-extrabold ${chartType === 'expense' ? 'text-gray-800' : 'text-gray-800'}`}>
                {formatRupiah(totalChartValue)}
              </h2>
            </div>

            {/* 2. CHART AREA (Donut Lebih Tebal) */}
            <div className="h-56 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={85}
                    paddingAngle={5}
                    dataKey="value"
                    cornerRadius={8}
                    stroke="none"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* 3. LEGEND WITH PROGRESS BARS */}
            <div className="mt-4 space-y-4">
              {chartData.map((entry, index) => {
                const percentage = ((entry.value / totalChartValue) * 100);
                return (
                  <div key={index} className="group">
                    <div className="flex justify-between items-end mb-1">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                        <span className="text-sm font-semibold text-gray-700">{entry.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-gray-800 mr-2">{formatRupiah(entry.value)}</span>
                        <span className="text-xs font-medium text-gray-400">{percentage.toFixed(0)}%</span>
                      </div>
                    </div>
                    {/* Visual Bar */}
                    <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-1000 ease-out" 
                        style={{ 
                          width: `${percentage}%`,
                          backgroundColor: COLORS[index % COLORS.length] 
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="bg-white p-10 rounded-[2rem] text-center border-2 border-dashed border-gray-200">
            <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <ArrowRightLeft className="text-gray-300" size={32} />
            </div>
            <h3 className="text-gray-800 font-bold mb-1">Tidak ada data</h3>
            <p className="text-gray-400 text-sm">Belum ada transaksi di bulan ini.</p>
          </div>
        )}

        {/* === LIST TRANSAKSI === */}
        {typeTransactions.length > 0 && (
          <div>
            <h3 className="font-bold text-gray-800 mb-4 px-1 flex items-center gap-2 text-sm uppercase tracking-wider opacity-70">
              <Filter size={16} /> Rincian Transaksi
            </h3>
            <div className="space-y-3">
              {typeTransactions.map((trx, index) => (
                <div 
                  key={trx.id}
                  onClick={() => navigate(`/transaction/${trx.id}`)}
                  className="bg-white p-4 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-gray-100 flex justify-between items-center cursor-pointer active:scale-95 transition-transform"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold ${
                      trx.type === 'income' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                    }`}>
                      {trx.categories?.name ? trx.categories.name.charAt(0).toUpperCase() : '?'}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 text-sm line-clamp-1">{trx.title}</h4>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <span>{new Date(trx.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
                        <span>•</span>
                        <span>{trx.categories?.name}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`font-bold text-sm ${trx.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                      {formatRupiah(trx.amount)}
                    </span>
                    <ChevronRight size={16} className="text-gray-300" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}