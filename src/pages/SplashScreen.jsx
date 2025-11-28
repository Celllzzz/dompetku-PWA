import { useEffect, useState } from 'react';
import { Wallet } from 'lucide-react';

export default function SplashScreen({ onFinish }) {
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFade(true);
      setTimeout(onFinish, 600); 
    }, 2500); // Tampil selama 2.5 detik

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-700 text-white transition-all duration-700 ease-in-out ${
        fade ? 'opacity-0 scale-110 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      <div className="relative">
        <div className="bg-white/20 backdrop-blur-sm p-6 rounded-3xl mb-6 animate-bounce shadow-xl border border-white/10">
          <Wallet size={64} className="text-white drop-shadow-md" />
        </div>
        {/* Hiasan glow di belakang icon */}
        <div className="absolute inset-0 bg-white rounded-full blur-2xl opacity-20 animate-pulse"></div>
      </div>
      
      <h1 className="text-4xl font-bold tracking-widest drop-shadow-sm mb-2">DOMPETKU</h1>
      <p className="text-blue-100 text-sm tracking-wide font-light mb-10">Kelola Keuanganmu Lebih Baik</p>

      {/* CSS Loader (defined in index.css) */}
      <span className="loader"></span>
    </div>
  );
}