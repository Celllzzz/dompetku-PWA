import { Link, useLocation } from 'react-router-dom';
import { Home, List, PlusCircle, User, Wallet, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useConfirm } from '../context/ConfirmContext';

export default function Layout({ children }) {
  const location = useLocation();
  const { logout } = useAuth();
  const { showConfirm } = useConfirm();
  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    showConfirm("Keluar Aplikasi?", "Anda harus login ulang untuk masuk kembali.", logout, "danger");
  };

  const menus = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/add', icon: PlusCircle, label: 'Tambah' },
    { path: '/categories', icon: List, label: 'Kategori' },
    { path: '/profile', icon: User, label: 'Profil' },
  ];

  return (
    // Container Utama: h-screen (tinggi layar penuh) & overflow-hidden (gak boleh scroll window)
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden">
      
      {/* === DESKTOP SIDEBAR (Fixed Left) === */}
      <aside className="hidden md:flex flex-col w-72 bg-white border-r border-gray-200 h-full p-6 shadow-sm z-20 flex-shrink-0">
        <div className="flex items-center gap-3 mb-10 px-2 animate-fade-in">
          <div className="p-2.5 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-200 transition-transform hover:scale-105">
            <Wallet size={28} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800 tracking-tight">DompetKu</h1>
            <p className="text-xs text-gray-400">Kelola Keuanganmu</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto pr-2 custom-scrollbar">
          {menus.map((item, index) => (
            <Link
              key={item.path}
              to={item.path}
              style={{ animationDelay: `${index * 50}ms` }}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 font-medium group relative overflow-hidden animate-slide-up ${
                isActive(item.path)
                  ? 'bg-blue-50 text-blue-600 shadow-sm'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              {isActive(item.path) && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-full"></div>
              )}
              
              <item.icon size={20} className={`transition-all duration-300 ${isActive(item.path) ? 'text-blue-600 translate-x-1' : 'text-gray-400 group-hover:text-gray-600'}`} />
              <span className={`transition-transform duration-300 ${isActive(item.path) ? 'translate-x-1' : ''}`}>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="pt-6 border-t border-gray-100 animate-fade-in">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl w-full transition-colors font-medium"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* === MAIN CONTENT AREA (Scrollable) === */}
      <main className="flex-1 flex flex-col h-full relative min-w-0">
        
        {/* Area Scroll (overflow-y-auto) */}
        <div className="flex-1 overflow-y-auto w-full scroll-smooth">
          <div className="max-w-5xl mx-auto w-full pb-28 md:pb-10 md:pt-8 md:px-8 min-h-full">
              {children}
          </div>
        </div>

        {/* === MOBILE BOTTOM NAV (Fixed Bottom Overlay) === */}
        <nav className="md:hidden absolute bottom-0 w-full bg-white/80 backdrop-blur-xl border-t border-gray-200/50 flex justify-around items-center pb-safe z-50 shadow-[0_-5px_20px_rgba(0,0,0,0.03)] h-[80px]">
          {menus.map((item) => {
            const active = isActive(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex-1 flex flex-col items-center justify-center h-full relative group"
              >
                {active && (
                  <span className="absolute top-0 w-10 h-1 bg-blue-600 rounded-b-lg shadow-[0_0_10px_rgba(37,99,235,0.5)] transition-all duration-300 animate-fade-in" />
                )}

                <div
                  className={`p-1.5 rounded-2xl transition-all duration-300 ${
                    active
                      ? 'text-blue-600 -translate-y-1'
                      : 'text-gray-400 group-hover:text-gray-600'
                  }`}
                >
                  <item.icon size={24} strokeWidth={active ? 2.5 : 2} />
                </div>

                <span className={`text-[10px] font-medium transition-all duration-300 ${
                  active ? 'text-blue-600 opacity-100' : 'text-gray-400 opacity-0 h-0 overflow-hidden group-hover:opacity-100 group-hover:h-auto'
                }`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

      </main>
    </div>
  );
}