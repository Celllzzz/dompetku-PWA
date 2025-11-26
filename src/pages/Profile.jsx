import { useAuth } from '../context/AuthContext';
import { useConfirm } from '../context/ConfirmContext'; // Untuk logout confirm
import { User, Mail, LogOut, CheckCircle, Smartphone, WifiOff, Info } from 'lucide-react';

export default function Profile() {
  const { user, logout } = useAuth(); // Ambil data user yang login
  const { showConfirm } = useConfirm();

  const handleLogout = () => {
    showConfirm("Logout?", "Anda harus login kembali untuk mengakses aplikasi.", () => {
      logout();
    }, "danger");
  };
  
  // Fitur list (sama seperti sebelumnya)
  const features = [
    { label: 'Pencatatan Transaksi', icon: CheckCircle },
    { label: 'Manajemen Kategori', icon: CheckCircle },
    { label: 'Mode Offline (PWA)', icon: Smartphone },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24 animate-fade-in">
      {/* Header Profile */}
      <div className="bg-white px-6 pt-8 pb-8 rounded-b-[3rem] shadow-sm mb-6 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
        
        {/* Avatar Dinamis (Pake inisial nama jika tidak ada foto) */}
        <div className="w-28 h-28 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4 shadow-lg border-4 border-white text-4xl font-bold text-blue-600">
           {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
        </div>
        
        {/* DATA DIRI DARI LOGIN */}
        <h1 className="text-2xl font-bold text-gray-800 mb-1">{user?.name}</h1>
        <div className="flex justify-center items-center gap-2 text-gray-500 mb-2">
          <span className="bg-gray-100 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wide text-gray-600">
            {user?.nim || 'No NIM'}
          </span>
        </div>
        
        <div className="flex justify-center items-center gap-2 text-gray-500 text-sm">
          <Mail size={14} />
          <span>{user?.email}</span>
        </div>
      </div>

      <div className="px-6 space-y-5">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-blue-100">
           {/* Deskripsi sama seperti sebelumnya */}
           <div className="flex items-center gap-2 mb-3 text-blue-600">
            <Info size={20} /> <h3 className="font-bold">Info</h3>
           </div>
           <p className="text-sm text-gray-600">Anda login sebagai <b>{user?.name}</b>.</p>
        </div>

        {/* Tombol Logout */}
        <button onClick={handleLogout} className="w-full bg-red-50 text-red-600 font-bold p-4 rounded-2xl shadow-sm border border-red-100 flex items-center justify-center gap-2 hover:bg-red-100 transition-colors">
          <LogOut size={20} /> Keluar Aplikasi
        </button>
      </div>
    </div>
  );
}