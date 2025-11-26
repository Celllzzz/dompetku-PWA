import { Link, useLocation } from 'react-router-dom';
import { Home, List, PlusCircle, User } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path ? "text-blue-600" : "text-gray-400";

  return (
    <nav className="fixed bottom-0 w-full bg-white border-t border-gray-200 flex justify-around py-3 z-40">
      <Link to="/" className={`flex flex-col items-center ${isActive('/')}`}>
        <Home size={24} /> <span className="text-[10px]">Home</span>
      </Link>
      <Link to="/add" className={`flex flex-col items-center ${isActive('/add')}`}>
        <PlusCircle size={24} /> <span className="text-[10px]">Tambah</span>
      </Link>
      <Link to="/categories" className={`flex flex-col items-center ${isActive('/categories')}`}>
        <List size={24} /> <span className="text-[10px]">Kategori</span>
      </Link>
      <Link to="/profile" className={`flex flex-col items-center ${isActive('/profile')}`}>
        <User size={24} /> <span className="text-[10px]">Profil</span>
      </Link>
    </nav>
  );
}