import { useEffect, useState } from 'react';
import { Wallet } from 'lucide-react';

export default function SplashScreen({ onFinish }) {
  const [fade, setFade] = useState(false);

  useEffect(() => {
    // Mulai animasi fade out setelah 2 detik
    const timer = setTimeout(() => {
      setFade(true);
      // Panggil fungsi selesai setelah animasi selesai
      setTimeout(onFinish, 500); 
    }, 2000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-blue-600 text-white transition-opacity duration-500 ${fade ? 'opacity-0' : 'opacity-100'}`}>
      <div className="bg-white p-4 rounded-3xl mb-4 animate-bounce">
        <Wallet size={48} className="text-blue-600" />
      </div>
      <h1 className="text-3xl font-bold tracking-widest">DOMPETKU</h1>
      <p className="text-blue-200 text-sm mt-2">Kelola Keuanganmu</p>
    </div>
  );
}