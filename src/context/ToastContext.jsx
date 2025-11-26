import { createContext, useContext, useState, useEffect } from "react";
import { CheckCircle, XCircle, X } from "lucide-react";

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);
  const [isExiting, setIsExiting] = useState(false); // State untuk animasi keluar

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setIsExiting(false); // Reset animasi masuk

    // Timer untuk auto-close
    setTimeout(() => {
      handleClose();
    }, 3000); // 3 detik tampil
  };

  const handleClose = () => {
    setIsExiting(true); // 1. Mulai animasi keluar
    setTimeout(() => {
      setToast(null); // 2. Hapus data setelah animasi selesai (300ms sesuai CSS)
      setIsExiting(false);
    }, 300);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {toast && (
        <div className={`fixed top-5 left-1/2 transform -translate-x-1/2 z-[100] 
          ${isExiting ? 'animate-popup-out' : 'animate-popup-in'}` // Class dinamis
        }>
          <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl border backdrop-blur-sm ${
            toast.type === 'success' 
              ? 'bg-white/95 border-green-500 text-green-700 shadow-green-100' 
              : 'bg-white/95 border-red-500 text-red-700 shadow-red-100'
          }`}>
            {toast.type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
            <span className="font-medium text-sm">{toast.message}</span>
            
            {/* Tombol Close Manual */}
            <button onClick={handleClose} className="ml-2 opacity-50 hover:opacity-100 p-1">
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
};