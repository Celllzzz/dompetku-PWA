import { useAuth } from '../context/AuthContext';
import { useConfirm } from '../context/ConfirmContext';
import { User, Mail, LogOut, Smartphone, WifiOff, Info, Zap, Shield, LayoutGrid, CheckCircle2 } from 'lucide-react';

export default function Profile() {
  const { user, logout } = useAuth();
  const { showConfirm } = useConfirm();

  const handleLogout = () => {
    showConfirm("Keluar Aplikasi?", "Anda harus login ulang untuk masuk kembali.", () => {
      logout();
    }, "danger");
  };
  
  // Data Fitur & Keunggulan
  const features = [
    { 
      title: 'Pencatatan Kilat', 
      desc: 'Input transaksi cepat & mudah.', 
      icon: Zap, 
      color: 'text-amber-500', 
      bg: 'bg-amber-50' 
    },
    { 
      title: 'Kategori Custom', 
      desc: 'Atur pos keuangan sesukamu.', 
      icon: LayoutGrid, 
      color: 'text-blue-500', 
      bg: 'bg-blue-50' 
    },
    { 
      title: 'Akses Offline', 
      desc: 'Jalan tanpa koneksi internet.', 
      icon: WifiOff, 
      color: 'text-purple-500', 
      bg: 'bg-purple-50' 
    },
    { 
      title: 'Privasi Data', 
      desc: 'Data transaksi hanya milikmu.', 
      icon: Shield, 
      color: 'text-green-500', 
      bg: 'bg-green-50' 
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 animate-fade-in">
      
      {/* === HEADER PROFILE === */}
      <div className="bg-white px-6 pt-10 pb-8 rounded-b-[2.5rem] shadow-sm mb-6 text-center relative overflow-hidden">
        {/* Dekorasi Background */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-3xl -mr-10 -mt-10 opacity-60"></div>
        
        {/* Avatar */}
        <div className="relative w-28 h-28 mx-auto mb-4 group">
          <div className="w-full h-full bg-gradient-to-tr from-blue-100 to-indigo-50 rounded-full flex items-center justify-center shadow-lg border-4 border-white text-4xl font-bold text-blue-600 transition-transform group-hover:scale-105">
             {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
          <div className="absolute bottom-1 right-1 bg-green-500 w-6 h-6 rounded-full border-4 border-white" title="Online"></div>
        </div>
        
        {/* Info User */}
        <h1 className="text-2xl font-bold text-gray-800 mb-1 tracking-tight">{user?.name || 'Pengguna'}</h1>
        
        <div className="flex justify-center items-center gap-2 mb-3">
          <span className="bg-gray-100 border border-gray-200 px-3 py-1 rounded-full text-[10px] font-mono font-bold text-gray-500 tracking-wider">
            {user?.nim || 'GUEST'}
          </span>
        </div>
        
        <div className="flex justify-center items-center gap-2 text-gray-500 text-sm bg-gray-50 py-1.5 px-4 rounded-xl inline-flex mx-auto">
          <Mail size={14} className="text-blue-500" />
          <span className="font-medium">{user?.email}</span>
        </div>
      </div>

      <div className="px-6 space-y-6">
        
        {/* === TENTANG APLIKASI === */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-16 h-16 bg-blue-50 rounded-bl-full -mr-2 -mt-2 opacity-50"></div>
          
          <div className="flex items-center gap-2 mb-3 text-blue-700">
            <Info size={20} /> 
            <h3 className="font-bold text-lg">Tentang DompetKu</h3>
          </div>
          <p className="text-gray-600 text-sm leading-relaxed">
            Aplikasi pencatat keuangan pribadi berbasis <b>PWA (Progressive Web App)</b>. Dirancang khusus untuk mahasiswa agar dapat memantau arus kas harian dengan mudah, cepat, dan bisa diakses langsung dari Homescreen HP Anda.
          </p>
        </div>

        {/* === FITUR & KEUNGGULAN (GRID) === */}
        <div>
          <h3 className="font-bold text-gray-800 mb-4 px-1 flex items-center gap-2">
            <CheckCircle2 size={18} className="text-blue-600"/> Keunggulan Aplikasi
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {features.map((item, index) => (
              <div key={index} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 hover:border-blue-200 transition-all hover:-translate-y-1">
                <div className={`w-10 h-10 ${item.bg} ${item.color} rounded-xl flex items-center justify-center mb-3`}>
                  <item.icon size={20} />
                </div>
                <h4 className="font-bold text-gray-800 text-sm mb-1">{item.title}</h4>
                <p className="text-xs text-gray-400 leading-snug">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* === INFO PENGEMBANG (Optional) === */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl p-5 text-white shadow-lg relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Developer</p>
            <p className="font-semibold">Celino Matande Wardana</p>
            <p className="font-semibold">21120123120020</p>
            <p className="text-xs text-gray-400 mt-0.5">Praktikum PPB 2025</p>
          </div>
          <Smartphone className="absolute right-4 bottom-4 text-white opacity-10 w-16 h-16" />
        </div>

        {/* === TOMBOL LOGOUT === */}
        <button 
          onClick={handleLogout} 
          className="w-full bg-white text-red-500 font-bold p-4 rounded-2xl shadow-sm border border-red-100 flex items-center justify-center gap-2 hover:bg-red-50 hover:border-red-200 transition-all active:scale-[0.98]"
        >
          <LogOut size={20} /> 
          <span>Keluar Aplikasi</span>
        </button>

        {/* Footer Kecil */}
        <div className="text-center pb-4 pt-2">
          <p className="text-[10px] text-gray-300 font-medium">v1.0.0 • DompetKu App</p>
        </div>

      </div>
    </div>
  );
}