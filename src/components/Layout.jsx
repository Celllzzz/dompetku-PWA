import { Link, useLocation } from 'react-router-dom';
import { Home, List, PlusCircle, User, Wallet, LogOut, Settings } from 'lucide-react';

export default function Layout({ children }) {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  // Menu Items Config
  const menus = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/add', icon: PlusCircle, label: 'Tambah', highlight: true }, // Highlight tombol tambah
    { path: '/categories', icon: List, label: 'Kategori' },
    { path: '/profile', icon: User, label: 'Profil' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 max-w-7xl mx-auto">
      
      {/* === DESKTOP SIDEBAR (Hidden on Mobile) === */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 h-screen sticky top-0 p-6">
        <div className="flex items-center gap-3 mb-10 text-blue-600">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Wallet size={28} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">DompetKu</h1>
        </div>

        <nav className="flex-1 space-y-2">
          {menus.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                isActive(item.path)
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-200'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-blue-600'
              }`}
            >
              <item.icon size={20} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="pt-6 border-t border-gray-100">
          <button className="flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl w-full transition-colors font-medium">
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* === MAIN CONTENT === */}
      <main className="flex-1 pb-24 md:pb-8 w-full">
        <div className="max-w-3xl mx-auto w-full">
            {children}
        </div>
      </main>

      {/* === MOBILE BOTTOM NAV (Hidden on Desktop) === */}
      <nav className="md:hidden fixed bottom-0 w-full bg-white/90 backdrop-blur-md border-t border-gray-200 flex justify-around py-3 pb-safe z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
        {menus.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center gap-1 transition-all duration-300 ${
              item.highlight ? '-mt-8' : ''
            }`}
          >
            <div
              className={`p-2 rounded-full transition-all duration-300 ${
                item.highlight
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-300 p-4'
                  : isActive(item.path)
                  ? 'text-blue-600'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <item.icon size={item.highlight ? 28 : 24} />
            </div>
            {!item.highlight && (
              <span className={`text-[10px] font-medium ${isActive(item.path) ? 'text-blue-600' : 'text-gray-400'}`}>
                {item.label}
              </span>
            )}
          </Link>
        ))}
      </nav>
    </div>
  );
}